import React, { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { wordsGroups } from '../../../../constants';
import { setCurrentPageData, selectCurrentGroup } from '../../../../store/slices/textbook';
import { formatPageDataForSlice, formatPageDataForUI, SEARCH_INITIAL_PAGE } from '../../helpers';

import './groups-tabs.scss';

const { TabPane } = Tabs;

const GroupsTabs: FC = () => {
  // eslint-disable-next-line
  const [_, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const group = useAppSelector(selectCurrentGroup);

  const onGroupChange = (groupKey: string) => {
    setParams({ group: groupKey, page: SEARCH_INITIAL_PAGE });
    const newPageData = {
      page: formatPageDataForSlice(SEARCH_INITIAL_PAGE),
      group: formatPageDataForSlice(groupKey),
    };
    dispatch(setCurrentPageData(newPageData));
  };

  return (
    <Tabs defaultActiveKey={formatPageDataForUI(group)} onChange={onGroupChange}>
      {[...wordsGroups].map((groupIndex) => (
        <TabPane key={groupIndex} tab={`Group ${groupIndex}`} />
      ))}
    </Tabs>
  );
};

export default GroupsTabs;
