import * as React from 'react';

import { CTA } from '@/components/marketing/sections/cta';
import { Hero } from '@/components/marketing/sections/hero';

export default function IndexPage(): React.JSX.Element {
  return (
    <>
      <Hero />
      <CTA />
    </>
  );
}
