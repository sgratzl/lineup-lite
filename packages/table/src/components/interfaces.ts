import { IIcons } from '../icons';
import { FullColumn as FullHookColumn } from '@lineup-lite/hooks';

export type MultiCustomizeKeys = 'tbody' | 'tr' | 'thead' | 'th' | 'thGroup' | 'td' | 'header';

export interface ISharedLineUpProps {
  classNames?: Partial<Record<MultiCustomizeKeys, string>>;
  styles?: Partial<Record<MultiCustomizeKeys, React.CSSProperties>>;
  /**
   * customize the icons to use
   */
  icons?: IIcons;
}

export type FullColumn<D extends object> = FullHookColumn<D> & {
  canHide?: boolean;
  tooltip?: string;
};
