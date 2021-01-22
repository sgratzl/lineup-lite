import type { FullColumn as FullHookColumn } from '@lineup-lite/hooks';
import type { HeaderGroup } from 'react-table';
import type { IActionIcons } from '../icons';

export type MultiCustomizeKeys = 'tbody' | 'tr' | 'thead' | 'th' | 'thGroup' | 'td' | 'header';

export interface ICustomizeLineUpProps {
  /**
   * hook for adding extra CSS classnames
   */
  classNames?: Partial<Record<MultiCustomizeKeys, string>>;
  /**
   * hoop for adding extra styles
   */
  styles?: Partial<Record<MultiCustomizeKeys, React.CSSProperties>>;
}

export interface IActionLineUpProps<D extends object> {
  /**
   * customize the icons to use
   */
  icons?: Partial<IActionIcons>;

  /**
   * callback for generating extra toolbar actions for a column
   */
  actions?: (column: HeaderGroup<D>) => React.ReactNode;
}

export type FullColumn<D extends object> = FullHookColumn<D> & {
  canHide?: boolean;
  tooltip?: string;
};
