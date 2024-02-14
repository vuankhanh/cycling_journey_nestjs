import { Document } from "mongoose";
import { Account } from "src/modules/auth/schemas/account.schema";

export type AccountDocument = Account & Document;