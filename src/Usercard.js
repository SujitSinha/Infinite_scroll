import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function Usercard({ userData }) {
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
 const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedJob, setEditedJob] = useState("");
  const [editId, setEditId] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const deleteHandleClose = () => {
    setShowDelete(false);
    setDeleteConfirm(false);
  };

  const handleOpen = (id) => {
    setOpen(true);
    console.log(id);
    fetch(`https://reqres.in/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUserDetails(data.data));
    setOpen(true);
  };

  const deleteConfirmation = () => {
    setDeleteConfirm(true);
    setShowDelete(false);
    deleteUser(deleteId);
  };

  const handleDelete = (id) => {
    setShowDelete(true);
    setDeleteId(id);
  };

  const deleteUser = (id) => {
    fetch(`https://reqres.in/api/users/${id}`, {
      method: "DELETE"
    }).then((res) => {
      console.log('deleted', res)
      setDeleteSuccess(true);
    });
  };

  const handleClose = () => setOpen(false);

  const fetchUserData = (id) => {
    fetch(`https://reqres.in/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserDetails(data.data);
        setEditedName(`${data.data.first_name} ${data.data.last_name}`);
      });
  };

  const handleUserEdit = (id) => {
    setEditSuccess(false);
    setIsEdit(true);
    setEditId(id);
    fetchUserData(id);
  };

  const handleEditClose = (id) => {
    setIsEdit(false);
  };

  const closeEditNotification = () => {
    setEditSuccess(false);
  };

  const closeDeleteNotification = () => {
    setDeleteSuccess(false);
  };

  const handleEditSave = () => {
    fetch(`https://reqres.in/api/users/${editId}`, {
      method: "PUT",
      body: {
        user: JSON.stringify(editedName),
        job: JSON.stringify(editedJob),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEditSuccess(true);
      });
    setIsEdit(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Grid container spacing={3}>
        {userData.length > 0 &&
          userData.map((user, index) => {
            return (
              <Grid
                item
                key={`GridItem-${index}`}
                xs={12}
                sm={8}
                md={4}
                lg={4}
                xl={4}
                align="center"
              >
                <Card sx={{ maxWidth: 355 }}>
                  <CardMedia
                    component="img"
                    height="325"
                    width="355"
                    image={user.avatar}
                    alt={user.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {user.first_name} {user.last_name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleOpen(user.id)}>
                      More Details
                    </Button>
                  </CardActions>
                  <EditIcon
                    onClick={() => handleUserEdit(user.id)}
                    style={{
                      marginLeft: "78%",
                      marginRight: "5%",
                      marginBottom: "5%",
                    }}
                  />
                  <DeleteSharpIcon
                    onClick={() => handleDelete(user.id)}
                    style={{
                      marginBottom: "5%",
                    }}
                  />
                </Card>
              </Grid>
            );
          })}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {userDetails.first_name} {userDetails.last_name}
          </Typography>
          <IconButton
            style={{ position: "absolute", left: "88%", top: "2%" }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <CardMedia
            component="img"
            height="355"
            width="355"
            image={userDetails.avatar}
            alt={userDetails.name}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {userDetails.email}
          </Typography>
        </Box>
      </Modal>
      <Dialog
        open={showDelete}
        onClose={deleteHandleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this user?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={deleteHandleClose}>No</Button>
          <Button onClick={deleteConfirmation}>Yes</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isEdit} onClose={handleEditClose}>
        <DialogTitle>Edit User Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="Job"
            label="Job"
            type="text"
            fullWidth
            value={editedJob}
            onChange={(e) => setEditedJob(e.target.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={editSuccess}
        autoHideDuration={1500}
        onClose={closeEditNotification}
        style={{
          color: "rgb(72 95 195)",
          position: "absolute",
          top: "-90%",
          left: "40%",
        }}
      >
        <Alert
          onClose={closeEditNotification}
          severity="success"
          sx={{ width: "100%" }}
        >
          User Data Edited Successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={1500}
        onClose={closeDeleteNotification}
        style={{
          color: "rgb(72 95 195)",
          position: "absolute",
          top: "-90%",
          left: "40%",
        }}
      >
        <Alert
          onClose={closeDeleteNotification}
          severity="error"
          sx={{ width: "100%" }}
        >
          User Deleted Successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default Usercard;
