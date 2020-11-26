import React, { Component } from "react";
import Loader from "../Components/Spinner/Spinner";
import { api_url } from "../Components/utils/utils";
import Cookies from "universal-cookie";
import axios from "axios";
import { Tab } from "semantic-ui-react";
import Tab1 from "../Components/Perfil/UsuarioPerfil";
import Tab2 from "../Components/Perfil/PreguntasUsuario";
import Tab3 from "../Components/Perfil/RespuestasUsuario";
import Tab4 from "../Components/Perfil/PreguntasCerradasUsuario";
import Tab5 from "../Components/Perfil/Mensajesusuario";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const cookies = new Cookies();
const user = cookies.get("cookie1");

class Perfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,

      // cookie: new Cookies(),
      user: {},
      usuarioUpdate: {
        userid: user.userid,
        usernombre: user.usernombre,
        userapellido: user.userapellido,
        userfechanacimiento: user.userfechanacimiento,
        usernick: user.usernick,
        userpass: "",
        useremail: user.useremail,
        userfoto: user.userfoto,
        usersexo: user.usersexo,
        userpuntaje: user.userpuntaje,
      },
      preguntas: {},
      preguntasCerradas: {},
      respuestas: {},
      passwordAnterior: "",
      //paginador
      page: 1,
      totalPreguntas: 0,
      totalPreguntasCerradas: 0,
      totalRespuestas: 0,
      totalMensajes: 0,
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = async () => {
    this.setState({
      loading: true,
      error: null,
    });
    try {
      const { data: responsePregunta } = await axios.get(
        `${api_url}/api/customqueries/pregXuser/${user.userid}?pageNumber=${this.state.page}`
      );

      const { data: responseRespuesta } = await axios.get(
        `${api_url}/api/customqueries/pregYrespXuser/${user.userid}?pageNumber=${this.state.page}`
      );

      const { data: responsePreguntaCerradas } = await axios.get(
        `${api_url}/api/customqueries/predCad/${user.userid}`
      );

      const { data: mensajeUser } = await axios.get(
        `${api_url}/api/customqueries/menUser/${user.userid}`
      );

      this.setState({
        preguntas: responsePregunta,
        respuestas: responseRespuesta,
        preguntasCerradas: responsePreguntaCerradas,
        menUser: mensajeUser,
        loading: false,
        error: null,
        totalPreguntas: responsePregunta.totalPages,
        totalRespuestas: responseRespuesta.totalPages,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: error,
      });
    }
  };
  handleChangeUpdate = (e) => {
    //maneja el cambio en el componente hijo y setea los valores a las variables de estado
    this.setState({
      usuarioUpdate: {
        ...this.state.usuarioUpdate,
        userid: this.state.usuarioUpdate.userid,
        usernombre: this.state.usuarioUpdate.usernombre,
        userapellido: this.state.usuarioUpdate.userapellido,
        userfechanacimiento: this.state.usuarioUpdate.userfechanacimiento,
        usernick: this.state.usuarioUpdate.usernick,
        userpass: this.state.usuarioUpdate.userpass,
        usersexo: this.state.usuarioUpdate.usersexo,
        useremail: this.state.usuarioUpdate.useremail,
        userfoto: this.state.usuarioUpdate.userfoto,
        [e.target.name]: e.target.value,
      },
    });
  };
  onClickButtonUpdate = async (e) => {
    //maneja el click del button para hacer el post del formulario pregunta
    this.setState({
      loading: true,
      error: null,
    });
    try {
      e.preventDefault();
      const response = await axios.put(
        `${api_url}/api/usuario/${this.state.usuarioUpdate.userid}`,
        this.state.usuarioUpdate
      );
      cookies.set("cookie1", this.state.usuarioUpdate, { path: "/" });
      window.location.reload();
      this.setState({
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: error,
      });
    }
  };
  handleChangeUpdatePassword = (e) => {
    //maneja el cambio en el componente hijo y setea los valores a las variables de estado
    this.setState({
      passwordAnterior: {
        [e.target.name]: e.target.value,
      },
    });
  };

  onClickButtonUpdatePassword = async (e) => {
    //maneja el click del button para hacer el post del formulario pregunta
    this.setState({
      loading: true,
      error: null,
    });
    try {
      e.preventDefault();
      if (this.state.passwordAnterior === user.userpass) {
        const response = await axios.put(
          `${api_url}/api/usuario/${this.state.usuarioUpdate.userid}`,
          this.state.usuarioUpdate
        );
        cookies.set("cookie1", this.state.usuarioUpdate, { path: "/" });
        // window.location.reload();
        console.log(this.state.passwordAnterior);
        console.log(user.userpass);
        this.setState({
          loading: false,
          error: null,
        });
      } else {
        console.log("no");
        window.location.reload();
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: error,
      });
    }
  };
  handleChangePagination = (e, value) => {
    this.state.page = value.activePage;
    this.fetchData();
  };

  panes = [
    {
      menuItem: { key: "Perfil", icon: "user", content: "Perfil" },
      render: () => (
        <Tab1
          eventoUpdate={this.handleChangeUpdate}
          formValuesUpdate={this.state.usuarioUpdate}
          buttonClickUpdate={this.onClickButtonUpdate}
          eventoUpdatePassword={this.handleChangeUpdatePassword}
          updatePassword={this.onClickButtonUpdatePassword}
        />
      ),
    },
    {
      menuItem: {
        key: "Preguntas",
        icon: "question circle",
        content: "Preguntas",
      },
      render: () => (
        <Tab2
          preguntasData={this.state.preguntas}
          onPageChange={this.handleChangePagination}
          total={this.state.totalPreguntas}
          page={this.state.page}
        />
      ),
    },
    {
      menuItem: { key: "Respuestas", icon: "talk", content: "Respuestas" },
      render: () => (
        <Tab3
          respuestasData={this.state.respuestas.data}
          onPageChange={this.handleChangePagination}
          total={this.state.totalRespuestas}
          page={this.state.page}
        />
      ),
    },
    {
      menuItem: {
        key: "Preguntas cerradas",
        icon: "question circle",
        content: "Preguntas cerradas",
      },
      render: () => <Tab4 preguntasData={this.state.preguntasCerradas.data} />,
    },
    {
      menuItem: {
        key: "Mensajes",
        icon: "inbox",
        content: "Mensajes",
      },
      render: () => <Tab5 mensajedata={this.state.menUser.data} />,
    },
  ];
  render() {
    if (this.state.loading) return <Loader />;
    if (this.state.error) return <div>Error</div>;
    return (
      <div style={{ marginTop: "2em" }}>
        <Tab
          menu={{
            style: { backgroundColor: "#283049" },
            inverted: true,
            fluid: true,
            vertical: true,
          }}
          panes={this.panes}
          menuPosition="left"
        />
      </div>
    );
  }
}

export default Perfil;
