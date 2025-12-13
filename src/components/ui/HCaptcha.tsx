import HCaptchaReact from '@hcaptcha/react-hcaptcha';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface HCaptchaHandle {
  resetCaptcha: () => void;
}

interface HCaptchaWrapperProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (err: string) => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact' | 'invisible';
}

// hCaptcha site key (public - safe to include in frontend)
const HCAPTCHA_SITE_KEY = 'f732c604-68c2-470a-9410-6fbcfd0425b2';

const HCaptchaWrapper = forwardRef<HCaptchaHandle, HCaptchaWrapperProps>(
  ({ onVerify, onExpire, onError, theme = 'light', size = 'normal' }, ref) => {
    const innerRef = useRef<HCaptchaReact>(null);

    useImperativeHandle(ref, () => ({
      resetCaptcha: () => {
        try {
          innerRef.current?.resetCaptcha();
        } catch {
          // no-op - widget may not be ready
        }
      },
    }));

    return (
      <div className="flex justify-center">
        <HCaptchaReact
          ref={innerRef}
          sitekey={HCAPTCHA_SITE_KEY}
          theme={theme}
          size={size}
          onVerify={(token) => onVerify(token)}
          onExpire={() => onExpire?.()}
          onError={(err) => onError?.(String(err))}
        />
      </div>
    );
  }
);

HCaptchaWrapper.displayName = 'HCaptchaWrapper';

export default HCaptchaWrapper;
