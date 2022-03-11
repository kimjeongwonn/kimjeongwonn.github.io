import React, { useEffect, useState } from 'react';
import {
  LayoutContainer,
  LayoutHeaderButton,
  LayoutMain,
  YearsContainer,
  YearsItem
} from './Layout.styled';
import LayoutHeader from './LayoutHeader';
import throttle from 'lodash/throttle';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  children: React.ReactNode;
  years: number[];
}

const Layout = ({ children, years = [] }: Props) => {
  const [isExtendsHeader, setIsExtendsHeader] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let lastScrollY = 0;
    let maxScrollY = Number.MAX_SAFE_INTEGER;
    const resizeHandler = throttle(() => {
      maxScrollY = window.document.body.scrollHeight - window.innerHeight;
    }, 500);

    const scrollHandler = throttle(
      () => {
        const scrollY = window.scrollY;
        if (scrollY < 0 || scrollY > maxScrollY) {
          return;
        }
        if (scrollY > lastScrollY) {
          setIsExtendsHeader(false);
          lastScrollY = scrollY;
        }
        if (scrollY < lastScrollY) {
          setIsExtendsHeader(true);
          lastScrollY = scrollY;
        }
      },
      250,
      { leading: false }
    );

    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <LayoutContainer>
      <LayoutHeader extended={isExtendsHeader} years={years} />
      <YearsContainer>
        {years.map(year => {
          const activeYear = String(router.query.year) === String(year);
          return (
            <YearsItem key={year} active={activeYear}>
              <Link passHref href={activeYear ? '/' : `/${year}`} scroll={false}>
                <LayoutHeaderButton as='a'>{year}</LayoutHeaderButton>
              </Link>
            </YearsItem>
          );
        })}
      </YearsContainer>
      <LayoutMain>{children}</LayoutMain>
    </LayoutContainer>
  );
};

export default Layout;
