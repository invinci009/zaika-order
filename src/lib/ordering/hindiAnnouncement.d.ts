export interface HindiAnnouncementItem {
  itemName?: string;
  name?: string;
  quantity?: number;
  qty?: number;
}

export type OrderModeType = 'DINE_IN' | 'PARCEL';

export declare const HINDI_NUMBERS: Record<number, string>;

export declare function numberToHindiWords(n: number | string): string;

export declare function formatHindiOrderItems(
  items?: Array<HindiAnnouncementItem | string> | null,
  maxToSpeak?: number
): string;

export declare function getBaseTableAnnouncement(
  tableLabel?: string | number | null,
  orderType?: OrderModeType | null
): string;

export declare function getHindiTableAnnouncement(
  tableLabelOrOrder?:
    | string
    | number
    | null
    | {
        tableLabel?: string | number | null;
        orderType?: OrderModeType | null;
        items?: Array<HindiAnnouncementItem | string>;
      },
  itemsList?: Array<HindiAnnouncementItem | string> | null
): string;

export declare const getHindiOrderAnnouncement: typeof getHindiTableAnnouncement;

export declare const SERVICE_REQUEST_HINDI: Record<string, string>;
export declare const SERVICE_REQUEST_ENGLISH_LABELS: Record<string, string>;

export declare function getTableLocationPhrase(
  tableLabel?: string | number | null,
  orderType?: OrderModeType | null
): string;

export declare function getHindiServiceAnnouncement(
  params?:
    | string
    | {
        tableLabel?: string | number | null;
        type?: string;
        note?: string;
      }
): string;

