'use client';
import Image from 'next/image';
import check from '@/assets/check.svg';
import { pricing } from '../constants';
import Button from '@/components/Button';

const PricingList = () => {
  return (
    <div className="flex gap-[1rem] max-lg:flex-wrap items-stretch max-lg:justify-center">
      {pricing.map((item) => (
        <div
          key={item.id}
          className="flex-1 max-w-[19rem] max-lg:w-full flex flex-col px-6 bg-n-8 border border-n-3 rounded-[2rem] lg:max-w-none even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
        >
          <h4 className="h4 mb-4 text-white">{item.title}</h4>
          <p className="body-2 min-h-[4rem] text-white mb-3 text-n-1/50">
            {item.description}
          </p>
          <div className="flex text-white items-center h-[5.5rem] mb-6">
            {item.price && (
              <>
                <div className="h3">$</div>
                <div className="text-[5.5rem] leading-none font-bold">
                  {item.price}
                </div>
              </>
            )}
          </div>
          <Button
            className="w-full mb-6 mt-auto"
            href={item.price ? '/pricing' : 'mailto:contact@jsmastery.pro'}
            white={!!item.price}
          >
            {item.price ? 'Get started' : 'Contact us'}
          </Button>
          <ul>
            {item.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start py-5 border-t border-n-3"
              >
                <Image
                  src={check}
                  alt="Check"
                  width={24}
                  height={24}
                />
                <p className="body-2 text-white ml-4">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PricingList;