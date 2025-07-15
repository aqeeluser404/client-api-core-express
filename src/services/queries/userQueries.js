
// ─── Dependencies ─────────────────────────────────────────────

import User from "../../models/userModel.js";

// ─── User Queries ─────────────────────────────────────────────

export async function findUserByUsernameOrEmail(username, email) {
    return await User.findOne({
        $or: [
            { username }, { email }
        ]
    })
}