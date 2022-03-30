import './profile.css';
import { useState, useContext} from 'react';
import firebase from '../../services/firebaseConnection';

import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Title from '../../components/Title';
import logo from '../../assets/logo.png';

import { MdAccountCircle } from "react-icons/md";
import { toast } from 'react-toastify';

export default function Profile(){
    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email] = useState(user && user.email);

    async function handleSave(e){
        e.preventDefault();

        if(nome !== ''){
            await firebase.firestore().collection('professores')
            .doc(user.uid)
            .update({
                nome: nome
            })
            .then(() =>{
                let data = {
                    ...user,
                    nome: nome
                };
                setUser(data);
                storageUser(data);
            })
        }
        toast.success('Nome alterado com sucesso!');
    }

    function resetPassword(e){
        e.preventDefault();
        if(email == ''){
          toast.error('Digite no campo "Email" o endereço de email!');
        }else{
          firebase.auth().sendPasswordResetEmail(user.email).then(()=>{
            toast.success('Email enviado para redefinição de senha.');
          })
          .catch(()=>{
            toast.error('Ocorreu um erro, tente novamente mais tarde!');
          });
        }
    }

    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="Minha Conta">
                    <MdAccountCircle color="#00488B" size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleSave}>
                        <label className="label-logo">
                            <img src={logo} alt="Univap logo" width="250"/>
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={ (e) => setNome(e.target.value) }/>
                    
                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />

                        <button type="submit">Salvar</button>

                    </form>
                </div>

                <div className="container">
                    <button className="logout-btn" onClick={resetPassword}>
                        Trocar minha senha
                    </button>
                </div>

                <div className="container">
                    <button className="logout-btn" onClick={ () => signOut()}>
                        Sair
                    </button>
                </div>

            </div>
        </div>
    )
}