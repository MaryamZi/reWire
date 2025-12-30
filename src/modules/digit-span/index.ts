import { DigitSpan } from './DigitSpan';
import type { ModuleDefinition } from '../../types/module';

export const digitSpanModule: ModuleDefinition = {
  id: 'digit-span',
  name: 'Digit Span',
  description: 'Remember and recall number sequences',
  icon: '🔢',
  component: DigitSpan
};
