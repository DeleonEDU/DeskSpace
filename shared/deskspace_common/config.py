import sys
from pathlib import Path


def configure_shared_path(base_dir: Path) -> None:
    """Add project shared/ package to sys.path for local and Docker runs."""
    project_root = base_dir.parent
    shared_path = project_root / "shared"
    shared_str = str(shared_path.resolve())
    if shared_path.is_dir() and shared_str not in sys.path:
        sys.path.insert(0, shared_str)


def get_secret_key(env, *, service_name: str) -> str:
    """Single SECRET_KEY for all services — required outside DEBUG."""
    key = env("SECRET_KEY", default=None)
    debug = env.bool("DEBUG", default=True)
    if not key and not debug:
        raise RuntimeError(f"SECRET_KEY must be set for {service_name} in production")
    return key or "deskspace-dev-only-change-in-production"
