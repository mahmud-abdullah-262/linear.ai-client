"use client";

import { useState } from "react";
import { Users } from "@/types/dashboard";
import { Task } from "@/types/taskTypes";
import { Rocket } from "@gravity-ui/icons";
import { Button, Modal, Label, ListBox, Select } from "@heroui/react";


interface TaskReAssignModalProps {
  task: Task;
  users: Users | null;
}

export function TaskReAssignModal({ task, users }: TaskReAssignModalProps) {

const userList = users?.users ?? [];
  // নির্বাচিত ইউজার বা তার ID ট্র্যাক রাখার জন্য স্টেট
  const [selectedUserId, setSelectedUserId] = useState<string | number | null>(null);

  const getUserId = (user: Users["users"][number]) => String(user._id || user.name);

const reassignTask = () => {
  const assignedUser = userList.find((user) => getUserId(user) === selectedUserId);
  console.log("Task Details:", task);
  console.log("Assigned User Details:", assignedUser);
};

  return (
    <Modal>
      <Button variant="ghost" className="text-white hover:text-slate-600 hover:font-bold">
        Re Assign
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-90">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-default text-foreground">
                <Rocket className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Task Reassign</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <h1>Task Title: {task.title}</h1>
              <p>Assign to: {task.assignedTo?.name ? task.assignedTo.name : '?'}</p>

              <div>
               <Select 
  className="w-[256px]" 
  placeholder="Select one"
  onSelectionChange={(keys) => {
    // keys যদি "all" হয় (সব সিলেক্ট করার অপশন থাকলে)
    if (keys === "all") return;

    // keys যদি Set হয় (React Aria-র ডিফল্ট আচরণ)
    if (typeof keys === "object" && keys !== null && "anchorKey" in keys === false && Symbol.iterator in keys) {
      const selected = Array.from(keys as Set<unknown>)[0];
      setSelectedUserId(selected ? String(selected) : null);
      return;
    }

    // keys যদি সরাসরি string বা number হয়
    if (typeof keys === "string" || typeof keys === "number") {
      setSelectedUserId(String(keys));
      return;
    }

    // যদি keys অবজেক্ট আকারে আসে এবং currentKey থাকে
    if (typeof keys === "object" && keys !== null && "currentKey" in keys) {
      const currentKey = (keys as { currentKey?: unknown }).currentKey;
      setSelectedUserId(currentKey ? String(currentKey) : null);
    }
  }}
>
                  <Label>Assign to</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                    {userList.map((user) => {
  const userId = getUserId(user);
  return (
    <ListBox.Item key={userId} id={userId} textValue={user.name}>
      {user.name}
      <ListBox.ItemIndicator />
    </ListBox.Item>
  );
})}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={reassignTask} className="w-full" slot="close">
                Assign
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}