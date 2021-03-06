import React, { useContext } from 'react';
import styled from 'styled-components';

import { AnalyticsService, ANALYTICS_CATEGORIES, SettingsContext } from 'v2/services';
import { languages } from 'v2/config';
import { translateRaw } from 'v2/translations';

const LanguagesList = styled.ul`
  flex-grow: 1;
  margin: 0;
  padding: 0 0 21px 0;
  list-style-type: none;
`;

interface LanguageProps {
  isSelected: boolean;
}

const Language = styled.li<LanguageProps>`
  margin: 0;
  padding: 15px 20px;
  border-top: 1px solid #e9e9e9;
  cursor: pointer;
  transition: background 0.3s ease-in;

  &:hover {
    background: #f2f2f2;
  }

  ${props => props.isSelected && 'background: #f2f2f2;'};
`;

const handleLanguageSelect = (
  code: string,
  languageSelection: string,
  changeLanguage: (language: string) => void
) => {
  if (code !== languageSelection) {
    changeLanguage(code);
    AnalyticsService.instance.track(ANALYTICS_CATEGORIES.SIDEBAR, 'Language changed', {
      lang: code
    });
    location.reload(); // ToDo: Fix this to reload. There's an issue with nested settings for this i think.
  }
};

function LanguageSelect() {
  const { language, updateLanguageSelection } = useContext(SettingsContext);
  return (
    <LanguagesList>
      {Object.entries(languages).map(([code, languageString]: [string, string]) => (
        <Language
          isSelected={language === code}
          key={code}
          onClick={() => handleLanguageSelect(code, language, updateLanguageSelection)}
        >
          {languageString}
        </Language>
      ))}
    </LanguagesList>
  );
}

export default {
  title: translateRaw('NEW_SIDEBAR_TEXT_1'),
  content: LanguageSelect
};
