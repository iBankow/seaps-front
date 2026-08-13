import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "seaps-front";

export function Sizes() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>TB</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>TB</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>TB</AvatarFallback>
      </Avatar>
    </div>
  );
}

export function Group() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MP</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  );
}
