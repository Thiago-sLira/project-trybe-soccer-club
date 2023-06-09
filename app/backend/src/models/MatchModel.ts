import { CreateMatch } from '../interfaces/MatchTypes';
import Match from '../database/models/Match';

export default class MatchModel {
  constructor(private match = Match) { }

  async getAllMatches() {
    const matches = await this.match.scope('withTeams').findAll();
    return matches;
  }

  async getAllMatchesInProgressWithoutScope(inProgress: boolean) {
    const matches = await this.match.findAll({
      where: {
        inProgress,
      },
    });
    return matches;
  }

  async getAllMatchesInProgress(inProgress: boolean) {
    const matches = await this.match.scope('withTeams').findAll({
      where: {
        inProgress,
      },
    });
    return matches;
  }

  async finishMatch(id: number) {
    await this.match.update({ inProgress: false }, { where: { id } });
  }

  async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number) {
    await this.match.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );

    const matchUpdated = await this.match.scope('withTeams').findByPk(id);
    return matchUpdated;
  }

  async createMatch(match: CreateMatch) {
    const matchCreated = await this.match.create({
      ...match,
      inProgress: true,
    });
    return matchCreated;
  }

  // async getMatchById(id: number) {
  //   const match = await this.match.findByPk(id);
  //   return match;
  // }
}
