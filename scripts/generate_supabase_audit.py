import os
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "supabase-audit2.md"

EXCLUDE_DIRS = {".git", ".next", "node_modules", ".pnpm-store"}
EXCLUDE_FILES = {"tsconfig.tsbuildinfo"}
EXCLUDE_SUFFIXES = {".lock", ".tsbuildinfo"}


def is_excluded(path: Path) -> bool:
    if any(part in EXCLUDE_DIRS for part in path.parts):
        return True
    if path.name in EXCLUDE_FILES:
        return True
    if any(path.name.endswith(suf) for suf in EXCLUDE_SUFFIXES):
        return True
    return False


def read_text(path: Path):
    try:
        data = path.read_bytes()
    except Exception:
        return None
    try:
        return data.decode("utf-8")
    except Exception:
        return None


def list_files():
    files = []
    for root, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for name in filenames:
            path = Path(root) / name
            if is_excluded(path):
                continue
            files.append(path)
    return sorted(files)


def classify(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel.startswith("app/") and rel.endswith("page.tsx"):
        return "page"
    if rel.startswith("components/"):
        return "component"
    if rel.startswith("hooks/"):
        return "hook"
    if rel.startswith("store/"):
        return "store"
    if rel.startswith("lib/"):
        return "lib"
    if rel.startswith("types/"):
        return "type"
    return "other"


def has_use_client(text: str) -> bool:
    return bool(re.search(r"^['\"]use client['\"]", text.strip().splitlines()[:3][0]) if text else False)


def is_async_page(text: str) -> bool:
    return "export default async function" in text


def find_static_data(text: str):
    arrays = re.findall(r"(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*\[", text)
    objects = re.findall(r"(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*\{", text)
    return list(dict.fromkeys(arrays + objects))


def extract_first_object_keys(text: str, var_name: str):
    # Best-effort: locate var assignment and first object literal in it
    pattern = re.compile(rf"(?:export\s+)?const\s+{re.escape(var_name)}\s*=\s*\[([\s\S]*?)\]")
    match = pattern.search(text)
    if not match:
        return []
    inner = match.group(1)
    obj_match = re.search(r"\{([\s\S]*?)\}", inner)
    if not obj_match:
        return []
    obj_body = obj_match.group(1)
    keys = re.findall(r"([A-Za-z0-9_]+)\s*:", obj_body)
    return list(dict.fromkeys(keys))


def find_imports(text: str):
    imports = []
    for match in re.finditer(r"import\s+([^;]+?)\s+from\s+['\"]([^'\"]+)['\"]", text):
        imports.append((match.group(2), match.group(1).strip()))
    return imports


def extract_types(text: str):
    types = []
    # interface
    for match in re.finditer(r"interface\s+([A-Za-z0-9_]+)\s*\{", text):
        name = match.group(1)
        start = match.end()
        depth = 1
        i = start
        while i < len(text) and depth > 0:
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
            i += 1
        body = text[start:i].strip()
        types.append((name, "interface", f"interface {name} {{\n{body}"))
    # type alias
    for match in re.finditer(r"type\s+([A-Za-z0-9_]+)\s*=\s*", text):
        name = match.group(1)
        start = match.end()
        # capture until semicolon
        end = text.find(";", start)
        if end == -1:
            continue
        body = text[start:end].strip()
        types.append((name, "type", f"type {name} = {body};"))
    return types


def find_state_hooks(text: str):
    state_vars = re.findall(r"useState\(([^)]*)\)", text)
    return state_vars


def find_handlers(text: str):
    handlers = re.findall(r"const\s+([A-Za-z0-9_]+)\s*=\s*\(.*?\)\s*=>", text)
    return handlers


def status_for_file(text: str, file_type: str):
    if text.strip() == "":
        return "empty"
    has_supabase = "supabase.from" in text or "createClient(" in text
    static_vars = find_static_data(text)
    if has_supabase and static_vars:
        return "partial"
    if has_supabase:
        return "connected"
    if static_vars:
        return "hardcoded"
    return "partial"


def infer_supabase_tables(path: str):
    tables = []
    lower = path.lower()
    if "product" in lower:
        tables += ["products", "product_images", "product_variants", "categories"]
    if "category" in lower or "collection" in lower or "shop" in lower:
        tables += ["categories", "products"]
    if "order" in lower:
        tables += ["orders", "order_items", "order_tracking"]
    if "cart" in lower:
        tables += ["orders", "order_items"]
    if "wishlist" in lower:
        tables += ["wishlists", "products"]
    if "address" in lower:
        tables += ["addresses"]
    if "profile" in lower or "account" in lower or "customer" in lower:
        tables += ["profiles", "addresses", "orders"]
    if "coupon" in lower:
        tables += ["coupons"]
    if "support" in lower or "ticket" in lower:
        tables += ["support_tickets", "support_replies"]
    if "analytics" in lower:
        tables += ["orders", "order_items", "products", "categories", "coupons"]
    if "admin" in lower:
        tables += ["profiles", "products", "orders", "categories", "coupons"]
    # de-dupe
    return list(dict.fromkeys(tables))


def build_report(files):
    out = []

    out.append("# Albaeon Supabase Readiness Audit")
    out.append("")

    # Section 1
    out.append("## 1. FILE STRUCTURE")
    for path in files:
        rel = path.relative_to(ROOT).as_posix()
        ftype = classify(path)
        text = read_text(path) or ""
        client = "client" if (text and "use client" in text) else "server"
        static_vars = find_static_data(text) if text else []
        static_flag = "hardcoded" if static_vars else "none"
        out.append(f"FILE: {rel}")
        out.append(f"TYPE: {ftype}")
        out.append(f"STATUS: {status_for_file(text, ftype)}")
        out.append(f"SUMMARY: {client} component, static data: {static_flag}")
        out.append("DETAILS:")
        out.append(f"- use client: {'YES' if 'use client' in text else 'NO'}")
        out.append(f"- static data variables: {', '.join(static_vars) if static_vars else 'NONE'}")
        out.append("")

    # Section 2
    out.append("## 2. COMPONENT INVENTORY")
    for path in files:
        if classify(path) != "component":
            continue
        rel = path.relative_to(ROOT).as_posix()
        text = read_text(path) or ""
        imports = find_imports(text)
        types = extract_types(text)
        state = find_state_hooks(text)
        handlers = find_handlers(text)
        out.append(f"FILE: {rel}")
        out.append("TYPE: component")
        out.append(f"STATUS: {status_for_file(text, 'component')}")
        out.append("SUMMARY: component file")
        out.append("DETAILS:")
        out.append(f"- use client: {'YES' if 'use client' in text else 'NO'}")
        out.append(f"- imports: {', '.join([f'{src} -> {what}' for src, what in imports]) if imports else 'NONE'}")
        out.append(f"- types/interfaces: {', '.join([t[0] for t in types]) if types else 'NONE'}")
        out.append(f"- internal state: {', '.join(state) if state else 'NONE'}")
        out.append(f"- handlers: {', '.join(handlers) if handlers else 'NONE'}")
        out.append("")

    # Section 3
    out.append("## 3. DATA INVENTORY")
    for path in files:
        text = read_text(path) or ""
        static_vars = find_static_data(text)
        if not static_vars:
            continue
        rel = path.relative_to(ROOT).as_posix()
        out.append(f"FILE: {rel}")
        out.append("TYPE: data")
        out.append("STATUS: hardcoded")
        out.append("SUMMARY: static data present")
        out.append("DETAILS:")
        for var in static_vars:
            keys = extract_first_object_keys(text, var)
            out.append(f"- variable: {var}")
            out.append(f"  fields: {', '.join(keys) if keys else 'UNKNOWN'}")
        out.append("")

    # Section 4
    out.append("## 4. TYPE DEFINITIONS")
    for path in files:
        text = read_text(path) or ""
        types = extract_types(text)
        if not types:
            continue
        rel = path.relative_to(ROOT).as_posix()
        for name, kind, body in types:
            out.append(f"FILE: {rel}")
            out.append("TYPE: type")
            out.append("STATUS: connected")
            out.append(f"SUMMARY: {kind} {name}")
            out.append("DETAILS:")
            out.append(body)
            out.append("")

    # Section 5
    out.append("## 5. CURRENT DATA FLOW")
    for path in files:
        if classify(path) != "page":
            continue
        rel = path.relative_to(ROOT).as_posix()
        text = read_text(path) or ""
        imports = find_imports(text)
        components = [what for src, what in imports if src.startswith("@/components")]
        out.append(f"FILE: {rel}")
        out.append("TYPE: page")
        out.append(f"STATUS: {status_for_file(text, 'page')}")
        out.append("SUMMARY: page data flow")
        out.append("DETAILS:")
        out.append(f"- components imported: {', '.join(components) if components else 'NONE'}")
        out.append("")

    # Section 6
    out.append("## 6. WHAT NEEDS SUPABASE CONNECTION")
    for path in files:
        text = read_text(path) or ""
        static_vars = find_static_data(text)
        if not static_vars:
            continue
        rel = path.relative_to(ROOT).as_posix()
        tables = infer_supabase_tables(rel)
        out.append(f"FILE: {rel}")
        out.append("TYPE: data")
        out.append("STATUS: hardcoded")
        out.append("SUMMARY: hardcoded data source")
        out.append("DETAILS:")
        out.append(f"- current source: {', '.join(static_vars)}")
        out.append(f"- suggested tables: {', '.join(tables) if tables else 'UNKNOWN'}")
        out.append("")

    # Section 7
    out.append("## 7. PAGES INVENTORY")
    for path in files:
        if classify(path) != "page":
            continue
        rel = path.relative_to(ROOT).as_posix()
        text = read_text(path) or ""
        imports = find_imports(text)
        components = [what for src, what in imports if src.startswith("@/components")]
        out.append(f"FILE: {rel}")
        out.append("TYPE: page")
        out.append(f"STATUS: {status_for_file(text, 'page')}")
        out.append("SUMMARY: page inventory")
        out.append("DETAILS:")
        out.append(f"- async: {'YES' if is_async_page(text) else 'NO'}")
        out.append(f"- use client: {'YES' if 'use client' in text else 'NO'}")
        out.append(f"- components: {', '.join(components) if components else 'NONE'}")
        out.append("")

    # Section 8
    out.append("## 8. HOOKS AND STORES")
    for path in files:
        ftype = classify(path)
        if ftype not in {"hook", "store"}:
            continue
        rel = path.relative_to(ROOT).as_posix()
        text = read_text(path) or ""
        out.append(f"FILE: {rel}")
        out.append(f"TYPE: {ftype}")
        out.append(f"STATUS: {status_for_file(text, ftype)}")
        out.append("SUMMARY: hook/store")
        out.append("DETAILS:")
        out.append(f"- use client: {'YES' if 'use client' in text else 'NO'}")
        out.append("")

    # Section 9
    out.append("## 9. API ROUTES")
    api_routes = [p for p in files if p.relative_to(ROOT).as_posix().startswith("app/api/")]
    if not api_routes:
        out.append("No API routes found.")
    else:
        for path in api_routes:
            rel = path.relative_to(ROOT).as_posix()
            out.append(f"FILE: {rel}")
            out.append("TYPE: api")
            out.append("STATUS: partial")
            out.append("SUMMARY: api route")
            out.append("DETAILS: UNKNOWN")
            out.append("")

    # Section 10
    out.append("## 10. KNOWN ISSUES OR INCONSISTENCIES")
    for path in files:
        text = read_text(path) or ""
        if not text:
            continue
        rel = path.relative_to(ROOT).as_posix()
        imports = find_imports(text)
        missing = []
        for src, _ in imports:
            if src.startswith("@/"):
                target = ROOT / src.replace("@/", "")
                if target.is_dir():
                    continue
                if not any(target.with_suffix(s).exists() for s in [".ts", ".tsx", ".js", ".jsx"]):
                    missing.append(src)
        if missing:
            out.append(f"FILE: {rel}")
            out.append("TYPE: issue")
            out.append("STATUS: partial")
            out.append("SUMMARY: missing imports")
            out.append("DETAILS:")
            out.append(f"- missing: {', '.join(missing)}")
            out.append("")

    # Priority list
    out.append("## PRIORITY CONNECT LIST")
    priority = []
    for path in files:
        text = read_text(path) or ""
        if find_static_data(text):
            rel = path.relative_to(ROOT).as_posix()
            tables = infer_supabase_tables(rel)
            priority.append((rel, tables))
    for rel, tables in priority:
        out.append(f"- {rel} -> {', '.join(tables) if tables else 'UNKNOWN'}")

    return "\n".join(out)


def main():
    files = list_files()
    report = build_report(files)
    OUTPUT.write_text(report, encoding="utf-8")


if __name__ == "__main__":
    main()
