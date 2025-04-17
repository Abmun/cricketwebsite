// api/news/models/news.js
module.exports = {
  kind: 'collectionType',
  collectionName: 'news',
  info: {
    name: 'News',
    description: 'Cricket news and articles',
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    title: {
      type: 'string',
      required: true,
    },
    slug: {
      type: 'uid',
      targetField: 'title',
      required: true,
    },
    coverImage: {
      type: 'media',
      required: true,
    },
    excerpt: {
      type: 'text',
      required: true,
    },
    content: {
      type: 'richtext',
      required: true,
    },
    category: {
      type: 'enumeration',
      enum: ['News', 'Match Reports', 'Opinion', 'Analysis', 'Interviews', 'Fantasy Tips'],
      required: true,
    },
    featured: {
      type: 'boolean',
      default: false,
    },
    author: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'plugin::users-permissions.user',
    },
    teams: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::team.team',
    },
    players: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::player.player',
    },
    matches: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::match.match',
    },
    tournaments: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::tournament.tournament',
    },
    tags: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::tag.tag',
    },
    seo: {
      type: 'component',
      component: 'shared.seo',
    }
  },
};

// api/match/models/match.js
module.exports = {
  kind: 'collectionType',
  collectionName: 'matches',
  info: {
    name: 'Match',
    description: 'Cricket match information',
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    title: {
      type: 'string',
      required: true,
    },
    tournament: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::tournament.tournament',
      required: true,
    },
    team1: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::team.team',
      required: true,
    },
    team2: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::team.team',
      required: true,
    },
    matchDate: {
      type: 'datetime',
      required: true,
    },
    venue: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::venue.venue',
      required: true,
    },
    status: {
      type: 'enumeration',
      enum: ['upcoming', 'live', 'completed', 'abandoned'],
      required: true,
      default: 'upcoming',
    },
    format: {
      type: 'enumeration',
      enum: ['Test', 'ODI', 'T20I', 'T20', 'First Class', 'List A', 'Women'],
      required: true,
    },
    team1Score: {
      type: 'component',
      component: 'match.innings-score',
      repeatable: true,
    },
    team2Score: {
      type: 'component',
      component: 'match.innings-score',
      repeatable: true,
    },
    tossWinner: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::team.team',
    },
    tossDecision: {
      type: 'enumeration',
      enum: ['bat', 'field'],
    },
    result: {
      type: 'string',
    },
    matchNotes: {
      type: 'richtext',
    },
    playerOfMatch: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::player.player',
    },
    highlights: {
      type: 'component',
      component: 'match.highlight',
      repeatable: true,
    },
    news: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::news.news',
    },
    seo: {
      type: 'component',
      component: 'shared.seo',
    }
  },
};

// api/player/models/player.js
module.exports = {
  kind: 'collectionType',
  collectionName: 'players',
  info: {
    name: 'Player',
    description: 'Cricket player information',
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    slug: {
      type: 'uid',
      targetField: 'name',
      required: true,
    },
    profileImage: {
      type: 'media',
    },
    dateOfBirth: {
      type: 'date',
    },
    nationality: {
      type: 'string',
    },
    bio: {
      type: 'richtext',
    },
    battingStyle: {
      type: 'string',
    },
    bowlingStyle: {
      type: 'string',
    },
    role: {
      type: 'enumeration',
      enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper', 'Wicket-keeper Batsman'],
    },
    teams: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::team.team',
    },
    testStats: {
      type: 'component',
      component: 'player.batting-stats',
    },
    odiStats: {
      type: 'component',
      component: 'player.batting-stats',
    },
    t20iStats: {
      type: 'component',
      component: 'player.batting-stats',
    },
    testBowlingStats: {
      type: 'component',
      component: 'player.bowling-stats',
    },
    odiBowlingStats: {
      type: 'component',
      component: 'player.bowling-stats',
    },
    t20iBowlingStats: {
      type: 'component',
      component: 'player.bowling-stats',
    },
    iccRankings: {
      type: 'component',
      component: 'player.icc-ranking',
      repeatable: true,
    },
    news: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::news.news',
    },
    seo: {
      type: 'component',
      component: 'shared.seo',
    }
  },
};
