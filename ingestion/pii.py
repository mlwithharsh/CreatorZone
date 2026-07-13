from cryptography.fernet import Fernet, InvalidToken


def encrypt_contact(value: str | None, key: str) -> str | None:
    if not value:
        return None
    if not key:
        return None
    return Fernet(key.encode("utf-8")).encrypt(value.encode("utf-8")).decode("utf-8")


def decrypt_contact(value: str | None, key: str) -> str | None:
    if not value or not key:
        return None
    try:
        return Fernet(key.encode("utf-8")).decrypt(value.encode("utf-8")).decode("utf-8")
    except InvalidToken:
        return None
