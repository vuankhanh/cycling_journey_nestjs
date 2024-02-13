import { Document } from "mongoose";
import { Account } from "src/schemas/account.schema";

export type AccountDocument = Account & Document;