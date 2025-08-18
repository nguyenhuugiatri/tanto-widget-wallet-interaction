import { ApproveAxs } from "./user-action/ApproveAxs"
import { ApproveWron } from "./user-action/ApproveWron"
import { AtiaActivation } from "./user-action/AtiaActivation"
import { PersonalSign } from "./user-action/PersonalSign"
import { SignTypedDataV4 } from "./user-action/SignTypedData"
import { StakingAxs } from "./user-action/StakingAxs"
import { SwapAxsOnKatana } from "./user-action/SwapAxsOnKatana"
import { TransferAxs } from "./user-action/TransferAxs"
import { TransferRon } from "./user-action/TransferRon"
import { TransferWron } from "./user-action/TransferWron"

export const UserAction = () => (
  <>
    <PersonalSign />
    <SignTypedDataV4 />
    <TransferRon />
    <TransferAxs />
    <ApproveAxs />
    <StakingAxs />
    <SwapAxsOnKatana />
    <ApproveWron />
    <TransferWron />
    <AtiaActivation />
    </>
)
