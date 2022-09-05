import React, { FC } from 'react';
import avatar from '../../../../assets/images/avatar.png';

import './team-section.scss';

const TeamSection: FC = () => (
  <div className="team-section">
    <h2 className="team-section--title">Our Team</h2>
    <div className="team-members--wrapper">
      <div className="team-member--card">
        <div className="team-member--pic">
          <img src={avatar} alt="Team member" />
        </div>
        <div className="team-member--name">Valiantsina Yelina</div>
        <div className="team-member--desc">
          Team Lead of our Development Team and an expert in Frontend and Backend interaction.
          Implemented Statistic Page and Audiochallenge Game. Set up registration and authorization
          features. Kept the team motivated no matter what.
          {' '}
        </div>
      </div>
      <div className="team-member--card">
        <div className="team-member--pic">
          <img src={avatar} alt="Team member" />
        </div>
        <div className="team-member--name">Nina Sitaeva</div>
        <div className="team-member--desc">
          Our expert in Redux features. Set up routing. Implemented Main Page and Textbook.
          Developed logic for displaying additional information for authorized user and working with
          difficult words. Code Review sessions enthusiast.
          {' '}
        </div>
      </div>
      <div className="team-member--card">
        <div className="team-member--pic">
          <img src={avatar} alt="Team member" />
        </div>
        <div className="team-member--name">Artem Smirnov</div>
        <div className="team-member--desc">
          Our expert in Antd Design and working with browser history. Devised shared components
          design. Implemented Sprint Game, logic for setting words collection for every game, and
          displaying game results. User Experience advocate.
          {' '}
        </div>
      </div>
    </div>
  </div>
);

export default TeamSection;