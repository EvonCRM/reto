'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CubeIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import {
  ChevronRightIcon,
  CircuitBoardIcon,
  FileBarChartIcon,
  LayoutIcon,
  PlayIcon
} from 'lucide-react';

import { GridSection } from '@/components/marketing/fragments/grid-section';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  UnderlinedTabs,
  UnderlinedTabsContent,
  UnderlinedTabsList,
  UnderlinedTabsTrigger
} from '@/components/ui/tabs';
import { Routes } from '@/constants/routes';
import { cn } from '@/lib/utils';

function HeroPill(): React.JSX.Element {
  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0, y: -20 }}
      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex items-center justify-center"
    >
      <Badge
        variant="outline"
        className="h-8 rounded-full px-3 text-xs font-medium shadow-sm sm:text-sm"
      >
        <div className="w-fit py-0.5 text-center text-xs text-blue-500 sm:text-sm">
          Technical Challenge
        </div>
      </Badge>
    </motion.div>
  );
}

function HeroTitle(): React.JSX.Element {
  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <h1 className="mt-6 text-center text-[48px] font-bold leading-[54px] tracking-[-1.2px] [font-kerning:none] sm:text-[56px] md:text-[64px] lg:text-[76px] lg:leading-[74px] lg:tracking-[-2px]">
        Form
        <br /> Builder
      </h1>
    </motion.div>
  );
}

function HeroDescription(): React.JSX.Element {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mx-auto mt-3 max-w-[560px] text-balance text-center text-lg leading-[26px] text-muted-foreground sm:text-xl lg:mt-6"
    >
      Create an application that allows users to build dynamic forms and
      interact with them intuitively. This is your technical challenge to
      showcase your development skills.
    </motion.p>
  );
}

function HeroButtons(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="mx-auto flex w-full flex-col gap-2 px-7 sm:w-auto sm:flex-row sm:px-0"
    >
      <Link
        href={Routes.FormBuilder}
        className={cn(
          buttonVariants({
            variant: 'default'
          }),
          'h-10 rounded-xl sm:h-9'
        )}
      >
        Start Challenge
      </Link>
    </motion.div>
  );
}

function MainDashedGridLines(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      <svg className="absolute left-[16.85%] top-0 hidden h-full w-px [mask-image:linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100%"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="hsl(var(--border))"
        />
      </svg>
      <svg className="absolute right-[16.85%] top-0 hidden h-full w-px [mask-image:linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100%"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="hsl(var(--border))"
        />
      </svg>
      <svg className="absolute bottom-[64px] left-[calc(50%-50vw)] hidden h-px w-screen [mask-image:linear-gradient(to_right,#0000,#000_100px,#000_calc(100%-100px),#0000)] lg:block">
        <line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="hsl(var(--border))"
        />
      </svg>
    </motion.div>
  );
}

function SupportiveDashedGridLines(): React.JSX.Element {
  return (
    <>
      <svg className="absolute left-[calc(50%-50vw)] top-[59px] z-10 hidden h-px w-screen [mask-image:linear-gradient(to_right,#0000,#000_100px,#000_calc(100%-100px),#0000)] lg:block">
        <line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="hsl(var(--border))"
        />
      </svg>
      <svg className="absolute left-[calc(50%-50vw)] top-0 z-10 hidden h-px w-screen [mask-image:linear-gradient(to_right,#0000,#000_100px,#000_calc(100%-100px),#0000)] lg:block">
        <line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="hsl(var(--border))"
        />
      </svg>
    </>
  );
}

function HeroIllustration(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="relative mt-8 lg:mt-12"
    >
      <div className="mx-auto max-w-4xl rounded-xl border bg-card p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Challenge Requirements
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Core Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Visual form builder</li>
              <li>• Field types: text, email, number, date, select</li>
              <li>• Real-time preview</li>
              <li>• Custom validations</li>
              <li>• Form saving and editing</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Technical Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Drag & drop interface</li>
              <li>• User responses collection</li>
              <li>• Statistics dashboard</li>
              <li>• Data export functionality</li>
              <li>• Responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero(): React.JSX.Element {
  return (
    <GridSection className="overflow-x-hidden">
      <MainDashedGridLines />
      <div className="mx-auto mt-16 flex flex-col gap-6 px-2 sm:mt-20 sm:px-1 md:mt-24 lg:mt-32">
        <div className="gap-2">
          <HeroPill />
          <HeroTitle />
        </div>
        <HeroDescription />
        <HeroButtons />
        <HeroIllustration />
      </div>
    </GridSection>
  );
}
