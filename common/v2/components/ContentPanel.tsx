import React from 'react';
import { Button, Panel, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { BREAK_POINTS } from 'v2/theme';
import Stepper from './Stepper';
import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';
import { translateRaw } from '../translations';

interface ContentPanelProps {
  width?: number;
  mobileMaxWidth?: string;
}

const ContentPanelWrapper = styled.div<ContentPanelProps>`
  position: relative;
  width: ${({ width }) => `${width}px`};
  max-width: ${({ width }) => `${width}px`};
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: ${({ mobileMaxWidth }) => mobileMaxWidth};
    padding-left: 0;
    margin: 0 auto 1em;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    &.has-side-panel {
      width: 100vw;
      max-width: 100vw;

      > section {
        width: 100%;
        max-width: 100%;
        padding-bottom: 0;

        > p ~ div {
          & > div:last-child {
            margin-top: calc(-0.5rem - 75px);
          }
        }
      }
    }
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    &.has-side-panel {
      width: ${({ width }) => `${width ? width + 375 : width}px`};
      max-width: ${({ width }) => `${width ? width + 375 : width}px`};
    }
  }
`;

const BackButton = styled(Button)`
  color: #007a99;
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 20px;
  img {
    margin-right: 13px;
  }
`;

const ContentPanelHeading = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #303030;
  font-size: 32px;
  font-weight: bold;
`;

const ContentPanelHeadingIcon = styled.img`
  width: 45px;
  height: 45px;
`;

const ContentPanelDescription = styled(Typography)`
  margin: 0;
  margin-bottom: 15px;
`;

interface ContentPanelTopProps {
  stepperOnly: boolean;
}

const ContentPanelTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props: ContentPanelTopProps) =>
    props.stepperOnly ? 'flex-end' : 'space-between'};
  margin: 0 30px 10px 30px;
  padding: 0;
`;

interface Props {
  children: any;
  className?: string;
  heading?: string;
  icon?: string;
  description?: string;
  stepper?: {
    current: number;
    total: number;
  };
  width?: number;
  mobileMaxWidth?: string;
  backBtnText?: string;
  onBack?(): void | null;
}

export default function ContentPanel({
  onBack,
  backBtnText,
  stepper,
  heading,
  icon,
  description,
  children,
  className = '',
  width = 650,
  mobileMaxWidth = '100%',
  ...rest
}: Props) {
  return (
    <ContentPanelWrapper className={className} width={width} mobileMaxWidth={mobileMaxWidth}>
      {(onBack || stepper) && (
        <ContentPanelTop stepperOnly={stepper !== undefined && !onBack}>
          {onBack && (
            <BackButton basic={true} onClick={onBack}>
              <img src={backArrowIcon} alt="Back arrow" />{' '}
              {backBtnText
                ? translateRaw('BACK_WITH_APPEND', { $append: `: ${backBtnText}` })
                : translateRaw('BACK')}
            </BackButton>
          )}
          {stepper && <Stepper current={stepper.current} total={stepper.total} />}
        </ContentPanelTop>
      )}
      <Panel {...rest}>
        {heading && (
          <ContentPanelHeading>
            {heading}
            {icon && <ContentPanelHeadingIcon src={icon} alt="Icon" />}
          </ContentPanelHeading>
        )}
        {description && <ContentPanelDescription>{description}</ContentPanelDescription>}
        {children}
      </Panel>
    </ContentPanelWrapper>
  );
}
