import type { HeaderGroup } from 'react-table';
import type { ActionIcons } from '../icons';
import type { UseLineUpLiteOptions } from './useLineUpLite';

export type MultiCustomizeKeys = 'tbody' | 'tr' | 'thead' | 'th' | 'thGroup' | 'td' | 'header';

export interface CustomizeLineUpProps {
  /**
   * hook for adding extra CSS classnames
   */
  classNames?: Partial<Record<MultiCustomizeKeys, string>>;
  /**
   * hoop for adding extra styles
   */
  styles?: Partial<Record<MultiCustomizeKeys, React.CSSProperties>>;
}

export interface ActionLineUpProps<D extends object> {
  /**
   * customize the icons to use
   */
  icons?: Partial<ActionIcons>;

  /**
   * callback for generating extra toolbar actions for a column
   */
  actions?: (column: HeaderGroup<D>) => React.ReactNode;
}

export interface LineUpLiteProps<D extends object>
  extends UseLineUpLiteOptions<D>,
    ActionLineUpProps<D>,
    CustomizeLineUpProps {
  className?: string;
  style?: React.CSSProperties;
  icons?: Partial<ActionIcons>;
  onStateChange?: (state: any) => void;
}
