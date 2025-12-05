import HCaptcha from '@hcaptcha/react-hcaptcha';
import { forwardRef } from 'react';

interface HCaptchaWrapperProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (err: string) => void;
}

// hCaptcha site key (public - safe to include in frontend)
const HCAPTCHA_SITE_KEY = 'f732c604-68c2-470a-9410-6fbcfd0425b2';

const HCaptchaWrapper = forwardRef<HCaptcha, HCaptchaWrapperProps>(
  ({ onVerify, onExpire, onError }, ref) => {
    return (
      <div className="flex justify-center">
        <HCaptcha
          ref={ref}
          sitekey={HCAPTCHA_SITE_KEY}
          onVerify={onVerify}
          onExpire={onExpire}
          onError={onError}
        />
      </div>
    );
  }
);

HCaptchaWrapper.displayName = 'HCaptchaWrapper';

export default HCaptchaWrapper;
