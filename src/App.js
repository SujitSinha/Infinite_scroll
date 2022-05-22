import { useState, useEffect, Suspense, lazy } from "react";
import "./App.css";
import "./App.scss";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
const Usercard = lazy(() => import("./Usercard.js"));

function App() {
  const [userData, setUserData] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [editUser, setEditUser] = useState("");
  const [editJob, setEditJob] = useState("");

  const [open, setOpen] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseNotification = () => {
    setAddSuccess(false);
    setAddError(false);
  };

  const addUser = () => {
    fetch("https://reqres.in/api/users", {
      method: "POST",
      body: {
        user: JSON.stringify(editUser),
        job: JSON.stringify(editJob),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAddSuccess(true);
        console.log("editUser", editUser, editJob);
        console.log("Success:", data);
      })
      .catch((error) => {
        setAddError(true);
        console.error("Error:", error);
      });
    setOpen(false);
  };

  const handleAdd = () => {
    addUser();
  };

  const fetchUserData = () => {
    setIsLoading(true);
    fetch(`https://reqres.in/api/users/?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (page > 1) {
          setUserData(userData.concat(data.data));
        } else {
          setUserData(data.data);
        }
        setPage(data.page);
        setTotalRecords(data.total);
        setTotalPages(data.total_pages);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, [page]);

  const handleScroll = () => {
    let userScrollHeight = window.innerHeight + window.scrollY;
    let windowBottomHeight = document.documentElement.offsetHeight;
    if (
      userScrollHeight >= windowBottomHeight &&
      userData.length < totalRecords &&
      page < totalPages
    ) {
      fetchMoreData();
    }
  };

  const fetchMoreData = () => {
    setPage((page) => page + 1);
  };

  return (
    <div className="App">
      <div className="header-container">
        <div className="header">
          <h3 className="title">User Management App</h3>
        </div>
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          style={{
            color: "rgb(72 95 195)",
            marginBottom: "2em",
            top: "0",
          }}
        >
          Create New User
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new user</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            variant="standard"
            onChange={(e) => setEditUser(e.target.value)}
          />
          <TextField
            margin="dense"
            id="Job"
            label="Job"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setEditJob(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={addSuccess}
        autoHideDuration={1500}
        onClose={handleCloseNotification}
        style={{
          color: "rgb(72 95 195)",
          position: "absolute",
          top: "-90%",
          left: "40%",
        }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="success"
          sx={{ width: "100%" }}
        >
          User Added Successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={addError}
        autoHideDuration={1500}
        onClose={handleCloseNotification}
        style={{
          color: "rgb(72 95 195)",
          position: "absolute",
          top: "-90%",
          left: "40%",
        }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="error"
          sx={{ width: "100%" }}
        >
          Something went wrong, user not added!
        </Alert>
      </Snackbar>
      <Suspense fallback={<CircularProgress />}>
        <div className="card-container" onScroll={handleScroll}>
          <Usercard userData={userData} />
        </div>
      </Suspense>
    </div>
  );
}

export default App;
