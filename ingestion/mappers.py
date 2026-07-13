from typing import Any


def notion_page_to_creator(page: dict[str, Any], contact_encrypted: str | None = None) -> dict[str, Any]:
    props = page.get("properties", {})
    return {
        "name": title_value(props.get("Name")) or "Untitled creator",
        "bio": rich_text_value(props.get("Bio")),
        "category": select_value(props.get("Category")),
        "languages": multi_select_values(props.get("Languages")),
        "region": rich_text_value(props.get("Region")) or select_value(props.get("Region")),
        "contact_encrypted": contact_encrypted,
        "notion_page_id": page["id"],
        "updated_at": page.get("last_edited_time"),
    }


def contact_from_page(page: dict[str, Any]) -> str | None:
    props = page.get("properties", {})
    return rich_text_value(props.get("Contact")) or email_value(props.get("Email")) or phone_value(props.get("Phone"))


def title_value(prop: dict[str, Any] | None) -> str | None:
    if not prop:
        return None
    title = prop.get("title") or []
    return "".join(part.get("plain_text", "") for part in title) or None


def rich_text_value(prop: dict[str, Any] | None) -> str | None:
    if not prop:
        return None
    rich_text = prop.get("rich_text") or []
    return "".join(part.get("plain_text", "") for part in rich_text) or None


def select_value(prop: dict[str, Any] | None) -> str | None:
    if not prop:
        return None
    selected = prop.get("select")
    if isinstance(selected, dict):
        return selected.get("name")
    return None


def multi_select_values(prop: dict[str, Any] | None) -> list[str]:
    if not prop:
        return []
    return [item["name"] for item in prop.get("multi_select", []) if item.get("name")]


def email_value(prop: dict[str, Any] | None) -> str | None:
    if not prop:
        return None
    return prop.get("email")


def phone_value(prop: dict[str, Any] | None) -> str | None:
    if not prop:
        return None
    return prop.get("phone_number")
