import json
import sys
from dataclasses import dataclass
from typing import Callable, Dict, List


TransformFn = Callable[[str], str]
Rarity = str


@dataclass(frozen=True)
class OrnamentTemplate:
    id: str
    name: str
    category: str
    rarity: Rarity
    transform_function: TransformFn


class OrnamentEngine:
    def __init__(self) -> None:
        self._templates: Dict[str, OrnamentTemplate] = {}

    def register_template(self, template: OrnamentTemplate) -> None:
        if template.id in self._templates:
            raise ValueError(f"template_already_exists:{template.id}")
        self._templates[template.id] = template

    def list_templates(self) -> List[Dict[str, str]]:
        return [
            {
                "id": tpl.id,
                "name": tpl.name,
                "category": tpl.category,
                "rarity": tpl.rarity,
            }
            for tpl in self._templates.values()
        ]

    def apply_template(self, template_id: str, text: str) -> Dict[str, str]:
        template = self._templates.get(template_id)
        if template is None:
            raise KeyError(f"template_not_found:{template_id}")

        original = str(text)
        decorated = template.transform_function(original)

        return {
            "templateId": template.id,
            "originalText": original,
            "decoratedText": decorated,
            "category": template.category,
            "rarity": template.rarity,
        }


def wrap(left: str, right: str, sep: str = " ") -> TransformFn:
    def transform(text: str) -> str:
        return f"{left}{sep}{text}{sep}{right}"

    return transform


def layered(outer_left: str, outer_right: str, inner_left: str, inner_right: str, sep: str = " ") -> TransformFn:
    def transform(text: str) -> str:
        return f"{outer_left}{sep}{inner_left}{sep}{text}{sep}{inner_right}{sep}{outer_right}"

    return transform


def split_with(left: str, right: str, joiner: str) -> TransformFn:
    def transform(text: str) -> str:
        compact = "".join(ch for ch in text if ch != "\n")
        return f"{left} {joiner.join(list(compact))} {right}"

    return transform


def micro_separator(left: str, right: str, token: str) -> TransformFn:
    def transform(text: str) -> str:
        return f"{left} {token} {text} {token} {right}"

    return transform


def gothic_overlay(marker: str, left: str, right: str) -> TransformFn:
    def transform(text: str) -> str:
        stylized = "".join((ch + marker) if not ch.isspace() else ch for ch in text)
        return f"{left} {stylized} {right}"

    return transform


def crest(
    top_left: str,
    top_fill: str,
    top_right: str,
    mid_left: str,
    mid_right: str,
    bottom_left: str,
    bottom_fill: str,
    bottom_right: str,
) -> TransformFn:
    def transform(text: str) -> str:
        width = max(8, len(text) + 6)
        top = f"{top_left}{top_fill * width}{top_right}"
        middle = f"{mid_left}  {text}  {mid_right}"
        bottom = f"{bottom_left}{bottom_fill * width}{bottom_right}"
        return f"{top}\n{middle}\n{bottom}"

    return transform


def cinematic_plate(left: str, right: str, line_char: str, sigil: str) -> TransformFn:
    def transform(text: str) -> str:
        width = max(10, len(text) + 8)
        line = line_char * width
        return f"{left}{line}{right}\n{sigil}  {text}  {sigil}\n{left}{line}{right}"

    return transform


def monogram(prefix: str, suffix: str, joiner: str) -> TransformFn:
    def transform(text: str) -> str:
        atoms = [ch for ch in text if ch != "\n"]
        return f"{prefix}{joiner.join(atoms)}{suffix}"

    return transform


def _template(
    template_id: str,
    name: str,
    category: str,
    rarity: Rarity,
    transform: TransformFn,
) -> OrnamentTemplate:
    return OrnamentTemplate(
        id=template_id,
        name=name,
        category=category,
        rarity=rarity,
        transform_function=transform,
    )


def build_engine() -> OrnamentEngine:
    engine = OrnamentEngine()

    templates: List[OrnamentTemplate] = [
        _template("royal_crown_frame", "Royal Crown Frame", "royal", "imperial", layered("♔", "♔", "❖", "❖")),
        _template("imperial_crest", "Imperial Crest", "imperial", "imperial", crest("╔", "═", "╗", "║", "║", "╚", "═", "╝")),
        _template("gold_emblem_style", "Gold Emblem Style", "luxury", "legendary", layered("✦", "✦", "◈", "◈")),
        _template("cyber_elite_frame", "Cyber Elite Frame", "futuristic", "elite", layered("⟦", "⟧", "⌈", "⌉")),
        _template("gothic_dark_sigil", "Gothic Dark Sigil", "gothic", "legendary", gothic_overlay("\u0336", "⸸", "⸸")),
        _template("islamic_geometric_frame", "Islamic Geometric Frame", "islamic", "legendary", layered("۞", "۞", "﴾", "﴿")),
        _template("platinum_monogram_style", "Platinum Monogram Style", "luxury", "elite", monogram("⟪", "⟫", " · ")),
        _template("baroque_signature", "Baroque Signature", "baroque", "legendary", layered("༺", "༻", "❦", "❧")),
        _template("minimal_ultra_luxury", "Minimal Ultra Luxury", "luxury", "elite", micro_separator("⟨", "⟩", "•")),
        _template("cinematic_studio_logo", "Cinematic Studio Logo", "cinematic", "imperial", cinematic_plate("▛", "▜", "▀", "◆")),
        _template("royal_scepter_line", "Royal Scepter Line", "royal", "legendary", wrap("⚜", "⚜")),
        _template("sultan_gate", "Sultan Gate", "imperial", "legendary", layered("۩", "۩", "❘", "❘")),
        _template("velvet_throne", "Velvet Throne", "royal", "elite", layered("❂", "❂", "—", "—")),
        _template("opal_insignia", "Opal Insignia", "luxury", "elite", layered("⟡", "⟡", "◉", "◉")),
        _template("baroque_scroll", "Baroque Scroll", "baroque", "legendary", layered("༼", "༽", "⧼", "⧽")),
        _template("baroque_grand", "Baroque Grand", "baroque", "imperial", crest("⟪", "═", "⟫", "⟬", "⟭", "⟪", "═", "⟫")),
        _template("gothic_abbey", "Gothic Abbey", "gothic", "legendary", gothic_overlay("\u0323", "☩", "☩")),
        _template("gothic_cathedral", "Gothic Cathedral", "gothic", "imperial", layered("✠", "✠", "⟪", "⟫")),
        _template("gothic_veil", "Gothic Veil", "gothic", "elite", gothic_overlay("\u0338", "⛧", "⛧")),
        _template("black_metal_sigil", "Black Metal Sigil", "black-metal", "legendary", split_with("⸸", "⸸", "⛧")),
        _template("cyber_grid", "Cyber Grid", "cyberpunk", "elite", split_with("⌬", "⌬", "◈")),
        _template("cyber_neuron", "Cyber Neuron", "cyberpunk", "legendary", layered("⟦", "⟧", "⧉", "⧉")),
        _template("cyber_hyperion", "Cyber Hyperion", "futuristic", "imperial", crest("╭", "─", "╮", "│", "│", "╰", "─", "╯")),
        _template("neon_arc", "Neon Arc", "neon", "elite", layered("⟨", "⟩", "◜", "◝")),
        _template("neon_drift", "Neon Drift", "neon", "legendary", split_with("⟬", "⟭", "•")),
        _template("neon_pulse", "Neon Pulse", "neon", "imperial", crest("╓", "─", "╖", "║", "║", "╙", "─", "╜")),
        _template("metallic_core", "Metallic Core", "metallic", "elite", layered("⧫", "⧫", "⟪", "⟫")),
        _template("steel_insignia", "Steel Insignia", "metallic", "legendary", crest("┏", "┉", "┓", "┃", "┃", "┗", "┉", "┛")),
        _template("titanium_mark", "Titanium Mark", "metallic", "imperial", layered("⟦", "⟧", "⟨", "⟩")),
        _template("imperial_eagle", "Imperial Eagle", "imperial", "imperial", layered("⟬", "⟭", "⦑", "⦒")),
        _template("imperial_archive", "Imperial Archive", "imperial", "legendary", crest("╔", "═", "╗", "║", "║", "╚", "═", "╝")),
        _template("imperial_signet", "Imperial Signet", "imperial", "elite", micro_separator("⟨", "⟩", "§")),
        _template("japanese_minimal_elite", "Japanese Minimal Elite", "japanese", "elite", layered("「", "」", "『", "』")),
        _template("zen_kinsai", "Zen Kinsai", "japanese", "legendary", layered("【", "】", "〖", "〗")),
        _template("shogun_mark", "Shogun Mark", "japanese", "imperial", crest("⟪", "─", "⟫", "⟨", "⟩", "⟪", "─", "⟫")),
        _template("fashion_runway", "Fashion Runway", "high-fashion", "elite", monogram("⟦", "⟧", " ")),
        _template("couture_signature", "Couture Signature", "high-fashion", "legendary", layered("⸜", "⸝", "◜", "◝")),
        _template("atelier_monarch", "Atelier Monarch", "high-fashion", "imperial", layered("⟬", "⟭", "❦", "❧")),
        _template("cinematic_noir", "Cinematic Noir", "cinematic", "legendary", cinematic_plate("▌", "▐", "█", "◈")),
        _template("cinematic_epic", "Cinematic Epic", "cinematic", "imperial", layered("⟨", "⟩", "⟪", "⟫")),
        _template("studio_platinum", "Studio Platinum", "cinematic", "elite", micro_separator("⟦", "⟧", "※")),
        _template("islamic_safavid", "Islamic Safavid", "islamic", "legendary", layered("۩", "۩", "﴿", "﴾")),
        _template("islamic_muqarnas", "Islamic Muqarnas", "islamic", "imperial", crest("╭", "◈", "╮", "│", "│", "╰", "◈", "╯")),
        _template("islamic_mihrab", "Islamic Mihrab", "islamic", "elite", layered("⟬", "⟭", "۞", "۞")),
        _template("arabic_luxury_gate", "Arabic Luxury Gate", "luxury", "legendary", layered("﴾", "﴿", "⟨", "⟩")),
        _template("arabic_dome_crest", "Arabic Dome Crest", "islamic", "imperial", crest("╔", "۞", "╗", "║", "║", "╚", "۞", "╝")),
        _template("arabic_royal_insignia", "Arabic Royal Insignia", "royal", "imperial", layered("۩", "۩", "❘", "❘")),
        _template("luxury_housemark", "Luxury Housemark", "luxury", "elite", layered("⟦", "⟧", "⌈", "⌋")),
        _template("luxury_gilded_badge", "Luxury Gilded Badge", "luxury", "legendary", layered("⟪", "⟫", "⦗", "⦘")),
        _template("luxury_vault", "Luxury Vault", "luxury", "imperial", crest("┏", "═", "┓", "┃", "┃", "┗", "═", "┛")),
        _template("royal_onyx_panel", "Royal Onyx Panel", "royal", "elite", micro_separator("⟨", "⟩", "◍")),
        _template("royal_grand_seal", "Royal Grand Seal", "royal", "legendary", layered("⟦", "⟧", "⸤", "⸥")),
        _template("royal_imperium", "Royal Imperium", "royal", "imperial", crest("╓", "═", "╖", "║", "║", "╙", "═", "╜")),
        _template("futuristic_helix", "Futuristic Helix", "futuristic", "elite", split_with("⟬", "⟭", "⫶")),
        _template("futuristic_quantum", "Futuristic Quantum", "futuristic", "legendary", layered("⟨", "⟩", "⌬", "⌬")),
        _template("futuristic_orbital", "Futuristic Orbital", "futuristic", "imperial", crest("╭", "◉", "╮", "│", "│", "╰", "◉", "╯")),
        _template("imperial_baroque_hybrid", "Imperial Baroque Hybrid", "imperial", "imperial", layered("༺", "༻", "⟦", "⟧")),
        _template("gothic_imperial_hybrid", "Gothic Imperial Hybrid", "gothic", "legendary", layered("✠", "✠", "╠", "╣")),
        _template("cinematic_monolith", "Cinematic Monolith", "cinematic", "imperial", monogram("⟦", "⟧", " | ")),
        _template("platinum_gallery_plate", "Platinum Gallery Plate", "luxury", "legendary", cinematic_plate("⟪", "⟫", "═", "✶")),
        _template("imperial_laurel_frame", "Imperial Laurel Frame", "imperial", "legendary", layered("❴", "❵", "❬", "❭")),
    ]

    for template in templates:
        engine.register_template(template)

    return engine


ENGINE = build_engine()


def read_payload() -> Dict[str, str]:
    raw = sys.stdin.read().strip()
    if not raw:
        return {"error": "empty_input"}

    try:
        data = json.loads(raw)
    except Exception:
        return {"error": "invalid_json"}

    if not isinstance(data, dict):
        return {"error": "invalid_payload"}

    return data


def main() -> None:
    payload = read_payload()
    if payload.get("error"):
        print(json.dumps(payload, ensure_ascii=False))
        return

    action = str(payload.get("action", "apply")).strip().lower()
    if action == "list":
        print(json.dumps({"templates": ENGINE.list_templates()}, ensure_ascii=False))
        return

    template_id = str(payload.get("templateId", "")).strip()
    text = str(payload.get("text") or payload.get("brandName") or "").strip()

    if not template_id:
        print(json.dumps({"error": "template_id_required"}, ensure_ascii=False))
        return

    if not text:
        print(json.dumps({"error": "text_required"}, ensure_ascii=False))
        return

    try:
        result = ENGINE.apply_template(template_id, text)
        print(json.dumps(result, ensure_ascii=False))
    except KeyError as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False))
    except Exception as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
