/**
 * A job is a task created by publishers to be performed by consumers.
 */
export default class Job {
  constructor(public message: string) {}
}
