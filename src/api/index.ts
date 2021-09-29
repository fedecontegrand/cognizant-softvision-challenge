import {Candidate} from "../types/candidate";

export default {
  candidates: {
    list: (): Promise<Candidate[]> =>
      import("./candidates.json").then((res) => res.default as Candidate[]),
  },
};
