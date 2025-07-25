import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import { HStack, Text, useDisclosure } from "@chakra-ui/react";
import { IconInbox, IconInboxOff } from "@tabler/icons-react";
import BButton from "../ui-custom/BButton";
import DisclosureHeaderContent from "../ui-custom/DisclosureHeaderContent";
import FloatCounter from "../ui-custom/FloatCounter";
import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
} from "../ui/drawer";
import { EmptyState } from "../ui/empty-state";
import { Tooltip } from "../ui/tooltip";

const Inbox = () => {
  // Contexts
  const { l } = useLang();

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`merchant-inbox`, open, onOpen, onClose);

  return (
    <>
      <Tooltip content={"Inbox"}>
        <BButton iconButton unclicky variant={"ghost"} onClick={onOpen}>
          <>
            <FloatCounter circleProps={{ mt: "18px", mr: "18px" }}>
              2
            </FloatCounter>

            <IconInbox stroke={1.5} />
          </>
        </BButton>
      </Tooltip>

      <DrawerRoot open={open} size={"xs"}>
        <DrawerContent minW={"360px"}>
          <DrawerHeader pt={5}>
            <DisclosureHeaderContent
              prefix="drawer"
              content={
                <HStack>
                  <IconInbox stroke={1.5} />
                  <Text fontSize={"16px"} fontWeight={"semibold"}>
                    Inbox
                  </Text>
                </HStack>
              }
            />
          </DrawerHeader>

          <DrawerBody display={"flex"}>
            <EmptyState
              icon={<IconInboxOff />}
              title={`Inbox ${l.empty.toLowerCase()}`}
              description={l.no_data_feedback.description}
              maxW={"300px"}
              m={"auto"}
            />
          </DrawerBody>

          <DrawerFooter>
            <BButton variant={"outline"}>{l.mark_as_read}</BButton>

            <BButton variant={"outline"} color={"fg.error"}>
              {l.delete_all_inbox_button}...
            </BButton>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export default Inbox;
