export type OrnamentRarity = 'elite' | 'legendary' | 'imperial';

export type OrnamentCollection =
  | 'royal_imperial'
  | 'gothic_dark_luxury'
  | 'arabic_luxury'
  | 'modern_fashion'
  | 'cyber_futuristic'
  | 'cinematic_branding'
  | 'ultra_minimal_luxury'
  | 'signature_branding';

export type OrnamentTemplateMeta = {
  id: string;
  name: string;
  category: string;
  collection: OrnamentCollection;
  rarity: OrnamentRarity;
};

export type OrnamentApplyResult = {
  templateId: string;
  originalText: string;
  decoratedText: string;
  category: string;
  collection: OrnamentCollection;
  rarity: OrnamentRarity;
};

type OrnamentTemplate = OrnamentTemplateMeta & {
  transformFunction: (text: string) => string;
};

const wrap = (left: string, right: string, sep = ' ') => (text: string) => `${left}${sep}${text}${sep}${right}`;

const layered =
  (outerLeft: string, outerRight: string, innerLeft: string, innerRight: string, sep = ' ') =>
  (text: string) =>
    `${outerLeft}${sep}${innerLeft}${sep}${text}${sep}${innerRight}${sep}${outerRight}`;

const splitWith =
  (left: string, right: string, joiner: string) =>
  (text: string) =>
    `${left} ${Array.from(text.replace(/\n/g, '')).join(joiner)} ${right}`;

const crest =
  (topLeft: string, topFill: string, topRight: string, midLeft: string, midRight: string, bottomLeft: string, bottomFill: string, bottomRight: string) =>
  (text: string) => {
    const width = Math.max(10, text.length + 8);
    const top = `${topLeft}${topFill.repeat(width)}${topRight}`;
    const middle = `${midLeft}  ${text}  ${midRight}`;
    const bottom = `${bottomLeft}${bottomFill.repeat(width)}${bottomRight}`;
    return `${top}\n${middle}\n${bottom}`;
  };

const overlay =
  (mark: string, left: string, right: string) =>
  (text: string) => {
    const styled = Array.from(text)
      .map((ch) => (/\s/.test(ch) ? ch : `${ch}${mark}`))
      .join('');
    return `${left} ${styled} ${right}`;
  };

const monogram =
  (prefix: string, suffix: string, joiner: string) =>
  (text: string) =>
    `${prefix}${Array.from(text.replace(/\n/g, '')).join(joiner)}${suffix}`;

function tpl(
  id: string,
  name: string,
  category: string,
  collection: OrnamentCollection,
  rarity: OrnamentRarity,
  transformFunction: (text: string) => string
): OrnamentTemplate {
  return { id, name, category, collection, rarity, transformFunction };
}

export class OrnamentEngine {
  private templates = new Map<string, OrnamentTemplate>();

  registerTemplate(template: OrnamentTemplate): void {
    if (this.templates.has(template.id)) {
      throw new Error(`template_already_exists:${template.id}`);
    }
    this.templates.set(template.id, template);
  }

  listTemplates(): OrnamentTemplateMeta[] {
    return Array.from(this.templates.values()).map(({ transformFunction: _transform, ...meta }) => meta);
  }

  applyTemplate(templateId: string, text: string): OrnamentApplyResult {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`template_not_found:${templateId}`);
    }

    const original = String(text);
    return {
      templateId: template.id,
      originalText: original,
      decoratedText: template.transformFunction(original),
      category: template.category,
      collection: template.collection,
      rarity: template.rarity
    };
  }
}

export function buildDefaultOrnamentEngine(): OrnamentEngine {
  const engine = new OrnamentEngine();

  const templates: OrnamentTemplate[] = [
    tpl('crown_frame', 'Crown Frame', 'royal', 'royal_imperial', 'imperial', layered('♔', '♔', '❖', '❖')),
    tpl('double_crown_frame', 'Double Crown Frame', 'royal', 'royal_imperial', 'imperial', layered('♚', '♚', '♔', '♔')),
    tpl('lion_crest_style', 'Lion Crest Style', 'imperial', 'royal_imperial', 'legendary', crest('╔', '═', '╗', '║', '║', '╚', '═', '╝')),
    tpl('imperial_insignia', 'Imperial Insignia', 'imperial', 'royal_imperial', 'imperial', layered('⟪', '⟫', '⦑', '⦒')),
    tpl('gold_monogram_frame', 'Gold Monogram Frame', 'luxury', 'royal_imperial', 'legendary', monogram('⟪', '⟫', ' · ')),
    tpl('platinum_border', 'Platinum Border', 'luxury', 'royal_imperial', 'elite', wrap('⟦', '⟧')),
    tpl('king_seal_style', 'King Seal Style', 'royal', 'royal_imperial', 'legendary', layered('⚜', '⚜', '⟬', '⟭')),
    tpl('baroque_royal_crest', 'Baroque Royal Crest', 'baroque', 'royal_imperial', 'imperial', layered('༺', '༻', '❦', '❧')),
    tpl('diamond_crest_frame', 'Diamond Crest Frame', 'luxury', 'royal_imperial', 'legendary', layered('✦', '✦', '◈', '◈')),
    tpl('victorian_emblem', 'Victorian Emblem', 'baroque', 'royal_imperial', 'elite', crest('╭', '─', '╮', '│', '│', '╰', '─', '╯')),

    tpl('black_metal_typography', 'Black Metal Typography', 'black-metal', 'gothic_dark_luxury', 'legendary', splitWith('⸸', '⸸', '⛧')),
    tpl('gothic_cathedral_frame', 'Gothic Cathedral Frame', 'gothic', 'gothic_dark_luxury', 'imperial', layered('✠', '✠', '⟪', '⟫')),
    tpl('dark_sigil_wrap', 'Dark Sigil Wrap', 'gothic', 'gothic_dark_luxury', 'legendary', overlay('\u0338', '⛧', '⛧')),
    tpl('rune_accent_overlay', 'Rune Accent Overlay', 'gothic', 'gothic_dark_luxury', 'elite', overlay('\u0323', '☩', '☩')),
    tpl('medieval_manuscript_frame', 'Medieval Manuscript Frame', 'gothic', 'gothic_dark_luxury', 'legendary', layered('⟬', '⟭', '⟦', '⟧')),
    tpl('bloodline_frame', 'Bloodline Frame', 'gothic', 'gothic_dark_luxury', 'legendary', crest('╓', '─', '╖', '║', '║', '╙', '─', '╜')),
    tpl('obsidian_border', 'Obsidian Border', 'dark-luxury', 'gothic_dark_luxury', 'elite', wrap('⬛', '⬛')),
    tpl('shadow_frame', 'Shadow Frame', 'dark-luxury', 'gothic_dark_luxury', 'elite', layered('⟨', '⟩', '◣', '◢')),
    tpl('infernal_sigil_style', 'Infernal Sigil Style', 'gothic', 'gothic_dark_luxury', 'imperial', splitWith('⛥', '⛥', '✶')),
    tpl('mystic_arcane_wrap', 'Mystic Arcane Wrap', 'gothic', 'gothic_dark_luxury', 'legendary', layered('☽', '☾', '✶', '✶')),

    tpl('islamic_geometric_frame', 'Islamic Geometric Frame', 'islamic', 'arabic_luxury', 'legendary', layered('۞', '۞', '﴾', '﴿')),
    tpl('andalusian_border', 'Andalusian Border', 'arabic', 'arabic_luxury', 'legendary', crest('╔', '۩', '╗', '║', '║', '╚', '۩', '╝')),
    tpl('diwani_crown_frame', 'Diwani Crown Frame', 'arabic', 'arabic_luxury', 'imperial', layered('۩', '۩', '❘', '❘')),
    tpl('kufi_gold_block', 'Kufi Gold Block', 'arabic', 'arabic_luxury', 'legendary', layered('⟦', '⟧', '◈', '◈')),
    tpl('ottoman_signature_frame', 'Ottoman Signature Frame', 'arabic', 'arabic_luxury', 'elite', monogram('﴾', '﴿', ' ')),
    tpl('mashrabiya_pattern_wrap', 'Mashrabiya Pattern Wrap', 'islamic', 'arabic_luxury', 'legendary', layered('◈', '◈', '⌘', '⌘')),
    tpl('crescent_imperial_style', 'Crescent Imperial Style', 'islamic', 'arabic_luxury', 'imperial', layered('☾', '☽', '✦', '✦')),
    tpl('calligraphic_shadow_frame', 'Calligraphic Shadow Frame', 'arabic', 'arabic_luxury', 'elite', layered('⟬', '⟭', '۞', '۞')),
    tpl('gold_ink_manuscript_style', 'Gold Ink Manuscript Style', 'arabic', 'arabic_luxury', 'legendary', overlay('\u0332', '✶', '✶')),

    tpl('vogue_style_frame', 'Vogue Style Frame', 'fashion', 'modern_fashion', 'legendary', layered('⟪', '⟫', '⟨', '⟩')),
    tpl('minimal_ultra_clean', 'Minimal Ultra Clean', 'modern', 'modern_fashion', 'elite', wrap('〈', '〉')),
    tpl('thin_platinum_border', 'Thin Platinum Border', 'modern', 'modern_fashion', 'elite', layered('⌜', '⌟', '⌞', '⌝')),
    tpl('serif_elite_signature', 'Serif Elite Signature', 'fashion', 'modern_fashion', 'legendary', monogram('⟦', '⟧', ' ')),
    tpl('high_fashion_logo_frame', 'High-Fashion Logo Frame', 'fashion', 'modern_fashion', 'imperial', layered('⟬', '⟭', '❦', '❧')),
    tpl('parisian_minimal_wrap', 'Parisian Minimal Wrap', 'fashion', 'modern_fashion', 'elite', wrap('✧', '✧')),
    tpl('black_gold_brand_style', 'Black & Gold Brand Style', 'fashion', 'modern_fashion', 'legendary', layered('⬛', '⬛', '✶', '✶')),
    tpl('editorial_magazine_look', 'Editorial Magazine Look', 'fashion', 'modern_fashion', 'imperial', crest('▛', '▀', '▜', '▌', '▐', '▙', '▄', '▟')),

    tpl('neon_edge_frame', 'Neon Edge Frame', 'cyberpunk', 'cyber_futuristic', 'elite', layered('⟨', '⟩', '◜', '◝')),
    tpl('cyberpunk_circuit_wrap', 'Cyberpunk Circuit Wrap', 'cyberpunk', 'cyber_futuristic', 'legendary', splitWith('⌬', '⌬', '◈')),
    tpl('digital_glitch_frame', 'Digital Glitch Frame', 'cyberpunk', 'cyber_futuristic', 'legendary', overlay('\u0336', '⟦', '⟧')),
    tpl('matrix_wrap', 'Matrix Wrap', 'futuristic', 'cyber_futuristic', 'elite', splitWith('⟬', '⟭', '⫶')),
    tpl('chrome_tech_border', 'Chrome Tech Border', 'futuristic', 'cyber_futuristic', 'legendary', layered('⧫', '⧫', '⌬', '⌬')),
    tpl('holographic_style', 'Holographic Style', 'futuristic', 'cyber_futuristic', 'imperial', crest('╭', '◉', '╮', '│', '│', '╰', '◉', '╯')),
    tpl('ai_neural_frame', 'AI Neural Frame', 'futuristic', 'cyber_futuristic', 'imperial', layered('⟦', '⟧', '⧉', '⧉')),
    tpl('sci_fi_emblem', 'Sci-Fi Emblem', 'futuristic', 'cyber_futuristic', 'legendary', crest('┏', '═', '┓', '┃', '┃', '┗', '═', '┛')),

    tpl('hollywood_studio_frame', 'Hollywood Studio Frame', 'cinematic', 'cinematic_branding', 'imperial', crest('▛', '▀', '▜', '▌', '▐', '▙', '▄', '▟')),
    tpl('marvel_style_emblem', 'Marvel Style Emblem', 'cinematic', 'cinematic_branding', 'legendary', layered('⟪', '⟫', '◆', '◆')),
    tpl('dark_knight_frame', 'Dark Knight Frame', 'cinematic', 'cinematic_branding', 'legendary', layered('⬛', '⬛', '⟦', '⟧')),
    tpl('epic_fantasy_logo', 'Epic Fantasy Logo', 'cinematic', 'cinematic_branding', 'imperial', crest('╔', '✶', '╗', '║', '║', '╚', '✶', '╝')),
    tpl('fire_glow_text', 'Fire Glow Text', 'cinematic', 'cinematic_branding', 'elite', overlay('\u0358', '🔥', '🔥')),
    tpl('ice_crystal_text', 'Ice Crystal Text', 'cinematic', 'cinematic_branding', 'elite', layered('❄', '❄', '✧', '✧')),
    tpl('thunder_stroke_style', 'Thunder Stroke Style', 'cinematic', 'cinematic_branding', 'legendary', overlay('\u0337', '⚡', '⚡')),
    tpl('smoke_frame', 'Smoke Frame', 'cinematic', 'cinematic_branding', 'elite', layered('☁', '☁', '◌', '◌')),

    tpl('micro_separator_wrap', 'Micro Separator Wrap', 'minimal', 'ultra_minimal_luxury', 'elite', wrap('•', '•')),
    tpl('thin_line_elite', 'Thin Line Elite', 'minimal', 'ultra_minimal_luxury', 'elite', wrap('—', '—')),
    tpl('single_corner_mark', 'Single Corner Mark', 'minimal', 'ultra_minimal_luxury', 'elite', wrap('⌜', '⌟')),
    tpl('floating_frame', 'Floating Frame', 'minimal', 'ultra_minimal_luxury', 'legendary', layered('·', '·', '⟨', '⟩')),
    tpl('invisible_border_style', 'Invisible Border Style', 'minimal', 'ultra_minimal_luxury', 'legendary', wrap('˹', '˼')),
    tpl('center_dot_signature', 'Center Dot Signature', 'minimal', 'ultra_minimal_luxury', 'elite', monogram('⟦', '⟧', ' · ')),

    tpl('platinum_signature', 'Platinum Signature', 'signature', 'signature_branding', 'legendary', monogram('⟪', '⟫', ' ')),
    tpl('brush_stroke_wrap', 'Brush Stroke Wrap', 'signature', 'signature_branding', 'elite', layered('〰', '〰', '✎', '✎')),
    tpl('wax_seal_frame', 'Wax Seal Frame', 'signature', 'signature_branding', 'legendary', layered('◉', '◉', '⟬', '⟭')),
    tpl('embossed_stamp', 'Embossed Stamp', 'signature', 'signature_branding', 'imperial', crest('┏', '┉', '┓', '┃', '┃', '┗', '┉', '┛')),
    tpl('ink_splash_elite', 'Ink Splash Elite', 'signature', 'signature_branding', 'elite', layered('✶', '✶', '✢', '✢')),
    tpl('gold_foil_signature', 'Gold Foil Signature', 'signature', 'signature_branding', 'imperial', layered('✦', '✦', '⟪', '⟫')),
    tpl('engraved_style', 'Engraved Style', 'signature', 'signature_branding', 'legendary', overlay('\u0332', '⌁', '⌁'))
  ];

  for (const template of templates) {
    engine.registerTemplate(template);
  }

  return engine;
}

export const ornamentEngine = buildDefaultOrnamentEngine();
