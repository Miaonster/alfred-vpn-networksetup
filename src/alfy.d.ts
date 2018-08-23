declare module 'alfy' {
  type ModDef = {
    valid?: boolean;
    arg?: string;
    subtitle?: string;
    icon?: string;
    variables?: unknown;
  };

  type AlfredItemMods = Partial<
    Record<'alt' | 'cmd' | 'meta' | 'shift' | 'control', ModDef>
  >;

  type AlfredText = Partial<Record<'copy' | 'largetype', string>>;

  type AlfredVariables = Record<string,string>;

  interface AlfredItem {
    uid?: string;
    title?: string;
    subtitle?: string;
    arg?: string;
    icon?: string;
    valid?: boolean;
    match?: string;
    autocomplete?: string;
    type?: 'default' | 'file' | 'file:skipcheck';
    mods?: AlfredItemMods;
    text?: AlfredText;
    variables?: AlfredVariables;
  }


  // API
  function output(items: AlfredItem[]): void;
}
