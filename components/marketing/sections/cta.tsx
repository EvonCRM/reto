'use client';

import * as React from 'react';

import { BlurFade } from '@/components/marketing/fragments/blur-fade';
import { GridSection } from '@/components/marketing/fragments/grid-section';
import { TextGenerateEffect } from '@/components/marketing/fragments/text-generate-effect';
import { Button } from '@/components/ui/button';

export function CTA(): React.JSX.Element {
  return (
    <GridSection className="bg-diagonal-lines">
      <div className="container flex flex-col items-center justify-between gap-6 bg-background py-16 text-center">
        <h3 className="m-0 max-w-fit text-3xl font-semibold md:text-4xl">
          <TextGenerateEffect words="Ready for the challenge?" />
        </h3>
        <BlurFade inView>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="default"
              className="h-10 gap-2 whitespace-nowrap rounded-full"
              onClick={() => (window.location.href = '/form-builder')}
            >
              Start Challenge
            </Button>
          </div>
        </BlurFade>
      </div>
    </GridSection>
  );
}
