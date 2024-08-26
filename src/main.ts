import { resolve } from 'path';
import { setFailed } from '@actions/core';
import * as core from '@actions/core';
import { Context } from '@actions/github/lib/context';
import { ContextHelper, Utils } from '@technote-space/github-action-helper';
import { Logger } from '@technote-space/github-action-log-helper';
import axios, {isAxiosError} from 'axios';
import { execute } from './process';

async function validateSubscription(): Promise<void> {
  const API_URL = `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/subscription`;

  try {
    await axios.get(API_URL, {timeout: 3000});
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      core.error(
        'Subscription is not valid. Reach out to support@stepsecurity.io'
      );
      process.exit(1);
    } else {
      core.info('Timeout or API not reachable. Continuing to next step.');
    }
  }
}

const run = async(): Promise<void> => {
  const logger  = new Logger();
  const context = new Context();
  ContextHelper.showActionInfo(resolve(__dirname, '..'), logger, context);

  await validateSubscription();

  await execute(logger, Utils.getOctokit(), context);
};

run().catch(error => {
  console.log(error);
  setFailed(error.message);
});
