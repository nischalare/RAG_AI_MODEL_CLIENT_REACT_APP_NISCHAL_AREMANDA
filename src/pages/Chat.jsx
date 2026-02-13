import { Box } from "@mui/material";
import ChatWindow from "../chat/ChatWindow";

const Chat = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        px: { xs: 1, sm: 2, md: 4 },
        py: 3,
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1000px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#111827",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
        }}
      >
        <ChatWindow />
      </Box>
    </Box>
  );
};

export default Chat;
