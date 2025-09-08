import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/system";


// Keep the styled component with the component that uses it
// const StyledUserCard = styled(Card)(({ theme }) => ({
//   cursor: "pointer",
//   transition: "all 0.2s ease-in-out",
//   "&:hover": {
//     boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
//     transform: "translateY(-2px)",
//   },
// }));

const StyledUserCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    boxShadow: (theme.shadows as string[])[3],
    transform: "translateY(-2px)",
  },
}));

// Define the interfaces for props
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListComponentProps {
  usersToDisplay: User[];
  selectedUser: User | null;
  searchTerm: string;
  totalPages: number;
  currentPage: number;
  onSearchChange: (term: string) => void;
  onSelectUser: (user: User) => void;
  onPageChange: (page: number) => void;
}

const UserListComponent: React.FC<UserListComponentProps> = ({
  usersToDisplay,
  selectedUser,
  searchTerm,
  totalPages,
  currentPage,
  onSearchChange,
  onSelectUser,
  onPageChange,
}) => {
  return (
    <Box
      flex={1}
      // width={900}
       maxWidth={400} // 900 was likely too wide. Adjust as needed.
       minWidth={350}
      p={3}
      borderRight="1px solid #e0e0e0"
      display="flex"
      flexDirection="column"
      sx={{
        bgcolor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        mx: 2,
        my: 3,
        height: 'calc(100% - 48px)',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: 'primary.main' }}>
        Employees
      </Typography>
      <TextField
        label="Search by name"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box flex={1} display="flex" flexDirection="column" gap={2} sx={{ overflowY: 'auto', pr: 0.5 }}>
        {usersToDisplay.length > 0 ? (
          usersToDisplay.map((u) => (
            <StyledUserCard
              key={u.id}
              onClick={() => onSelectUser(u)}
              sx={{
                border:
                  selectedUser?.id === u.id
                    ? "2px solid #1976d2"
                    : "1px solid #e0e0e0",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {u.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {u.email}
                </Typography>
              </CardContent>
            </StyledUserCard>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No users found.
          </Typography>
        )}
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, value) => onPageChange(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default UserListComponent;