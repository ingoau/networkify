"use client";

import { getUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Users } from "@/lib/types";
import * as tokenUtils from "@/lib/tokenUtils";
import { useGraphState, usePreferencesState } from "@/lib/state";

export function Discover({
  setUsersAction: setUsers,
  updateGraphAction: updateGraph,
  users,
  activeOperations,
  discoverAction: discover,
}: {
  setUsersAction: React.Dispatch<React.SetStateAction<Users>>;
  updateGraphAction: () => void;
  users: Users;
  activeOperations: number;
  discoverAction: (id: string) => void;
}) {
  const { setToken, token } = usePreferencesState();
  const { selected } = useGraphState();

  const discoverActions: {
    usersToSearch: User[];
    text: string;
  }[] = [
    {
      text: "All unsearched nodes",
      usersToSearch: users.filter(
        (user) =>
          user.searchState == "not_searched" && !user.exclude_from_graph,
      ),
    },
    {
      text: "Nodes with no follows",
      usersToSearch: users.filter(
        (user) =>
          !user.exclude_from_graph &&
          user.followers.length + user.following.length == 0,
      ),
    },
    {
      text: "Searched nodes w/ no follows",
      usersToSearch: users.filter(
        (user) =>
          user.searchState == "searched" &&
          !user.exclude_from_graph &&
          user.followers.length + user.following.length == 0,
      ),
    },
    {
      text: "Errored nodes",
      usersToSearch: users.filter(
        (user) => user.searchState == "error" && !user.exclude_from_graph,
      ),
    },
    {
      text: "All nodes",
      usersToSearch: users.filter((user) => !user.exclude_from_graph),
    },
    {
      text: "Selected nodes",
      usersToSearch: selected
        .map((userid) => users.find((user) => user.username === userid))
        .filter((user) => !!user)
        .filter((user) => !user.exclude_from_graph),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="border-y border-dashed flex flex-row">
        <div className="px-3 flex justify-center items-center border-r border-dashed bg-card">
          Token
        </div>
        <Input
          className="blur-[5px] hover:blur-none focus:blur-none duration-300 border-0"
          placeholder="Token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onPaste={(e) => {
            e.preventDefault();
            try {
              const token = tokenUtils.getFromClipboard(e);
              setToken(token);
            } catch {
              setToken(e.clipboardData.getData("text"));
            }
          }}
        />
      </div>
      <Button
        variant="ghost"
        className="border-b border-dashed"
        disabled={!token}
        onClick={async () => {
          try {
            const data = await getUser(token);
            setUsers([
              {
                followers: [],
                following: [],
                name: data.name,
                searchState: "not_searched",
                username: data.username,
                exclude_from_graph: false,
              },
            ]);
            updateGraph();
          } catch {
            toast.error("Something went wrong. Maybe aquire another token.");
          }
        }}
      >
        Add current user
      </Button>
      {discoverActions.map((action, index) => (
        <Button
          disabled={!token || !action.usersToSearch.length}
          key={index}
          onClick={() => {
            action.usersToSearch.forEach((user) => {
              user.searchState = "searching";
              discover(user.username);
            });
            updateGraph();
          }}
          variant="ghost"
          className="border-b"
        >
          {action.text} ({action.usersToSearch.length})
        </Button>
      ))}
      <div>{activeOperations} active searches</div>
    </div>
  );
}
