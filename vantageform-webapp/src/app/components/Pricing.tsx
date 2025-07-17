'use client';

import Section from '@/components/Section';
import Heading from '@/components/Heading';
import PricingList from '@/components/PricingList';
import { LeftLine, RightLine } from '@/components/design/Pricing';

const Pricing = () => {
  return (
    <Section
      className="bg-gradient-to-b from-n-8 to-n-7 overflow-hidden max-lg:justify-center scroll-mt-28"
      crosses
      crossesOffset="lg:translate-y-[1rem]"
      customPaddings
      id="pricing"
    >
      <div className="container relative z-2">
        <Heading
                  tag="Get started with VantageForm"
                  title="Premium Experience" className={"text-white"} text={undefined}        />

        {/* Pricing Content and Design Lines */}
        <div className="relative mb-10">
          <PricingList />
          <LeftLine />
          <RightLine />
        </div>

      </div>
    </Section>
  );
};

export default Pricing;
