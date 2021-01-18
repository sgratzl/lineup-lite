import type { FullColumn as FullHookColumn } from '@lineup-lite/hooks';
import type { HeaderGroup } from 'react-table';
import type { IIcons } from '../icons';

export type MultiCustomizeKeys = 'tbody' | 'tr' | 'thead' | 'th' | 'thGroup' | 'td' | 'header';

export interface ISharedLineUpProps<D extends object> {
  /**
   * hook for adding extra CSS classnames
   */
  classNames?: Partial<Record<MultiCustomizeKeys, string>>;
  /**
   * hoop for adding extra styles
   */
  styles?: Partial<Record<MultiCustomizeKeys, React.CSSProperties>>;
  /**
   * customize the icons to use
   */
  icons?: IIcons;

  /**
   * callback for generating extra toolbar actions for a column
   */
  actions?: (column: HeaderGroup<D>) => React.ReactNode;
}

export type FullColumn<D extends object> = FullHookColumn<D> & {
  canHide?: boolean;
  tooltip?: string;
};
