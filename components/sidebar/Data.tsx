"use client";

import { Button } from "@/components/ui/button";
import * as dataUtils from "@/lib/dataUtils";
import { Users } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "../ui/input";
import { useGraphState, useSave } from "@/lib/state";
import { ArchiveRestore, Trash } from "lucide-react";

export function Data({
  setUsersAction: setUsers,
  users,
}: {
  setUsersAction: (users: Users) => void;
  users: Users;
}) {
  const saves = useSave((state) => state.save);
  const createSave = useSave((state) => state.create);
  const deleteSave = useSave((state) => state.delete);

  const { edges, nodes } = useGraphState();

  return (
    <div className="flex flex-col border-t">
      <Button
        variant="ghost"
        className="border-b border-dashed"
        onClick={() => {
          setUsers([]);
        }}
      >
        Clear all
      </Button>
      <Button
        variant="ghost"
        className="border-b border-dashed"
        onClick={() => {
          const data = {
            users,
          };

          dataUtils.exportData(data);
        }}
      >
        Save
      </Button>
      <Button
        variant="ghost"
        className="border-b"
        onClick={() => {
          dataUtils.loadFromExport().then((data) => {
            setUsers(data.users);
          });
        }}
      >
        Load
      </Button>
      <div className="bg-card p-4">
        <Accordion
          type="single"
          collapsible
          className="border rounded-md bg-background"
        >
          <form
            className="flex flex-row required border-b"
            onSubmit={(e) => {
              e.preventDefault();
              const formElement = e.target as HTMLFormElement;
              const formData = new FormData(formElement);
              const data = Object.fromEntries(formData.entries());
              const saveName = data.name.toString();
              if (!saveName) return;
              createSave({ users }, saveName);
              formElement.reset();
            }}
          >
            <Input
              required
              name="name"
              placeholder="Save name"
              className="border-0!"
            />
            <Button>Save</Button>
          </form>
          <AccordionItem value="saves">
            <AccordionTrigger className="px-4">Saves</AccordionTrigger>
            <AccordionContent className="p-0!">
              <div className="flex flex-col">
                {saves.map((s) => (
                  <div
                    className="border-t rounded-md flex flex-row bg-card"
                    key={s.id}
                  >
                    <div className="flex flex-col p-4 border-r grow bg-background">
                      <div>{s.name}</div>
                      <div className="text-xs">
                        {new Date(s.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-row border-b h-fit bg-background">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          deleteSave(s.id);
                        }}
                      >
                        <Trash />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() => {
                          setUsers(s.data.users);
                        }}
                      >
                        <ArchiveRestore />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {saves.length === 0 && <div>No saves available</div>}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
