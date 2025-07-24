import { Link } from "react-router-dom"; // Note: Changed to react-router-dom for standard practice
import { School, GitBranch } from "lucide-react"; // Importing icons for a nice UI

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        {/* COLLEGE & BRANCH INFO - UPDATED SECTION */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {friend.college && (
            <span className="badge badge-secondary text-xs">
              <School className="size-3 mr-1" />
              {friend.college}
            </span>
          )}
          {friend.branch && (
            <span className="badge badge-outline text-xs">
              <GitBranch className="size-3 mr-1" />
              {friend.branch}
            </span>
          )}
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-primary btn-sm w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

// The getLanguageFlag function is no longer needed and has been removed.