export type BehaviorEventType =
  | "page_view"
  | "session_start"
  | "session_end"
  | "button_click";

export type BaseBehaviorModel = {
  type: BehaviorEventType;
  eventTime: Date;
  pageUrl: string;
  pageParams: string;
  pagePath: string;
  userId: string;
};

export type BehaviorPageViewModel = BaseBehaviorModel & {
  type: "page_view";
};

export type BehaviorSessionModel = BaseBehaviorModel & {
  type: "session_start" | "session_end";
  sessionId: string;
};

export type BehaviorButtonClickModel = BaseBehaviorModel & {
  type: "button_click";
  btnName: string;
};
