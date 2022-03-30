import './dashboard.css';
import { useState, useEffect, useContext } from 'react';
import firebase from '../../services/firebaseConnection';

import Title from '../../components/Title';
import Header from '../../components/Header';

import { MdPeopleOutline } from "react-icons/md";
import { toast } from 'react-toastify';

import { AuthContext } from '../../contexts/auth';

export default function Dashboard(){
    const [matricula, setMatricula] = useState('');
    const [ocorrido, setOcorrido] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [materia, setMateria] = useState("");

    const [nome, setNome] = useState("");
    const [turma, setTurma] = useState("");
    const [curso, setCurso] = useState("");
    const [emailResponsavel, setEmailResponsavel] = useState(""); 
    const [nomeResponsavel, setNomeResponsavel] = useState("");
    const [numeroResponsavel, setNumeroResponsavel] = useState("");

    const [dataOcorrencia, setdataOcorrencia] = useState('');

    const [ocorrencia, setOcorrencia] = useState([]);

    const { user, signOut } = useContext(AuthContext);

    const listRef = firebase.firestore().collection('tipoOcorrencia');

    const [isDisable, setIsDisabled] = useState('');

    function clearAreas(){
        setMatricula('');
        setNome('');
        setCurso('');
        setTurma('');
        setMateria('');
        setOcorrido('');
        setComentarios('');
    }

    useEffect(async()=> {

        async function loadOcorrencias(){
            await listRef
            .onSnapshot((doc)=>{
              let minhasOcorrencia = [];
      
              doc.forEach((item)=>{
                minhasOcorrencia.push({
                  id: item.id,
                  nomeOcorrencia: item.data().nomeOcorrencia
                })
              });
      
              setOcorrencia(minhasOcorrencia);
      
            });
        }
        await firebase.firestore().collection('suspensas')
        .doc(user.uid).get()
        .then((snapshot) => {
            setIsDisabled(snapshot.data().disable);
        });
        loadOcorrencias();
    }); 
    
    async function verifySession(e){
        e.preventDefault();
        if(isDisable === 'true'){
            signOut();
            toast.error('Sua conta foi suspensa!');
        }
        if(isDisable === 'false'){
            cadastrar();
        }
    }
    
    function Horario(){
        var dia = new Date().getDate(); 
        var mes = new Date().getMonth() + 1;  
        var horas = new Date().getHours();
        var minutos = new Date().getMinutes();
        setdataOcorrencia(
          dia + '/' + mes + ' ' + horas + ':' + minutos
        );
    }

    async function procuraAluno(){
        if(matricula === ''){
            toast.error('Insira corretamente a matrícula.')
        }else{
            async function dados(){
                await firebase.firestore().collection('alunos').doc(matricula).get().then((snapshot) => {
                  setTurma(snapshot.data().turma);
                  setNome(snapshot.data().nome);
                  setCurso(snapshot.data().curso)
                  setEmailResponsavel(snapshot.data().emailResponsavel);
                  setNomeResponsavel(snapshot.data().nomeResponsavel);
                  setNumeroResponsavel(snapshot.data().numeroResponsavel);
                })
                .catch((err)=>{
                    toast.error('Matrícula não encontrada.')
                })
            }
            dados();
        }
    }

    function dadosDoAluno(e){
        Horario();
        procuraAluno();
        e.preventDefault();
    }

    async function cadastrar(){
        if(matricula === '' || materia === ''){
          toast.error('Preencha corretamente os campos.');
        }else{
          await firebase.firestore().collection('ocorrencias')
          .add({
            aluno: nome,
            matricula: matricula,
            turma: turma,
            curso: curso,
            professor: user.nome,
            materiaProfessor: materia,
            comentariosOrientador: '',
            ocorrido: ocorrido,
            comentarios: comentarios,
            data: dataOcorrencia,
            status: 'Aberto',
            emailResponsavel: emailResponsavel,
            nomeResponsavel: nomeResponsavel,
            numeroResponsavel: numeroResponsavel,
            tipo: 'Ocorrência'
          });
          toast.success('Ocorrência enviada com sucesso!');
        }
        clearAreas();
    }

    function handleOcorrido(e){
        setOcorrido(e.target.value);
    }

    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="Ocorrência">
                    <MdPeopleOutline color="#00488B" size={25} />
                </Title>
                
                <div className="container">
                    <form className="form-student">
                        <label>Matricula</label>
                        <input type="text" placeholder="Matricula" value={matricula} onChange={ (e) => setMatricula(e.target.value) }/>
                        <button onClick={dadosDoAluno}>Procurar</button>
                    </form> 
                </div>

                <div className="container">
                    <form className="form-student">
                        <label>Nome: {nome}</label>
                        <label>Curso: {curso}</label>
                        <label>Turma: {turma}</label>
                    </form>
                </div>

                <div className="container">
                    <form className="form-student">
                        <label>Matéria:</label>
                        <input type="text" placeholder="Matéria" value={materia} onChange={ (e) => setMateria(e.target.value) }/>
                    </form>
                </div>

                <div className="container">
                    <form className="form-profile">
                        <label>Tipos de ocorrências:</label>
                        {ocorrencia.map((item, index)=>{
                            return(
                                <div key={index} className="radios">
                                    <div className="status">
                                        <input 
                                        type="radio"
                                        name={item.nomeOcorrencia}
                                        value={item.nomeOcorrencia}
                                        onChange={handleOcorrido}
                                        checked={ ocorrido === item.nomeOcorrencia }
                                        />
                                        <a>{item.nomeOcorrencia}</a>
                                    </div>
                                </div>
                            )
                        })}   
                    </form>
                </div>

                <div className="container">
                    <form className="form-profile">
                        <label>Comentários:</label>
                        <textarea
                        type="text"
                        placeholder="Nenhum comentário."
                        value={comentarios}
                        onChange={ (e) => setComentarios(e.target.value) }
                        />
                    </form>
                </div>
                        
                <div className="container">
                    <form className="form-profile">
                        <button onClick={verifySession}>Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}