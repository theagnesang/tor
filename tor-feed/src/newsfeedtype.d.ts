// types.d.ts
type UUID = string; // Define UUID, BigInt, Int16Array if not already defined globally

type FeedItemArray = {
  item_id: UUID;
  type: string;
  content: string;
  parent_id: UUID;
  created_at: string;
  user_id: BigInt;
  shared_feedid: UUID;
  private_feedid: UUID;
  depth: Int16Array;
  group_id: bigint;
};

type SavedItemArray = {
  savedpost_id: UUID;
  user_id: bigint;
  item_id: UUID;
  created_at: string;
};


type BuddyRequestArray = {
  request_id: bigint
  requestor_id: bigint
  recipient_id: bigint
  status: string
  timestamp: string
};