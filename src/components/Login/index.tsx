import { LockFilled } from '@ant-design/icons';
import cr from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { FormInput } from '..';
import { EMAIL_REGEX } from '../../helpers';
import { selectMobileDeviceState } from '../../modules/public/globalSettings';
import './style.css';

const Logo = require('../../assets/images/logo_branca_bandeira_verde.svg');

export interface LogInProps {
	labelSignIn?: string;
	labelSignUp?: string;
	emailLabel?: string;
	passwordLabel?: string;
	receiveConfirmationLabel?: string;
	forgotPasswordLabel?: string;
	isLoading?: boolean;
	title?: string;
	onForgotPassword: (email?: string) => void;
	onConfirmationResend?: (email?: string) => void;
	onSignUp: () => void;
	onSignIn: () => void;
	className?: string;
	image?: string;
	email: string;
	emailError: string;
	password: string;
	passwordError: string;
	emailFocused: boolean;
	emailPlaceholder: string;
	passwordFocused: boolean;
	passwordPlaceholder: string;
	isFormValid: () => void;
	refreshError: () => void;
	handleChangeFocusField: (value: string) => void;
	changePassword: (value: string) => void;
	changeEmail: (value: string) => void;
}



const Login = React.memo((props: LogInProps) => {
	const {
		email,
		emailError,
		emailPlaceholder,
		password,
		passwordError,
		passwordPlaceholder,
		isLoading,
		onSignUp,
		image,
		labelSignIn,
		// labelSignUp,
		emailLabel,
		passwordLabel,
		emailFocused,
		passwordFocused,
	} = props;

	const isMobileDevice = useSelector(selectMobileDeviceState);
	const history = useHistory();
	const intl = useIntl();
	const isValidForm = () => {
		const isEmailValid = props.email.match(EMAIL_REGEX);

		return props.email && isEmailValid && props.password;
	};

	const handleChangeEmail = (value: string) => {
		props.changeEmail(value);
	};

	const handleChangePassword = (value: string) => {
		props.changePassword(value);
	};

	const handleFieldFocus = (field: string) => {
		props.handleChangeFocusField(field);
	};

	const handleSubmitForm = () => {
		props.refreshError();
		props.onSignIn();
	};

	const handleValidateForm = () => {
		props.isFormValid();
	};

	const handleClick = (label?: string, e?: React.FormEvent<HTMLInputElement>) => {
		if (e) {
			e.preventDefault();
		}
		if (!isValidForm()) {
			handleValidateForm();
		} else {
			handleSubmitForm();
		}
	};

	const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();

			handleClick();
		}
	};

	const renderForgotButton = (
		<div
			className="cr-sign-in-form__bottom-section"
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<div className="cr-sign-in-form__bottom-section-password" onClick={() => props.onForgotPassword(email)}>
				{'Esqueceu sua senha?'}
			</div>
			<div
				id="click-to-register"
				className="cr-sign-in-form__bottom-section-signup"
				style={{
					fontSize: '14px',
					cursor: 'pointer',
					color: 'var(--button-primary-cta-background-color)',
				}}
				onClick={onSignUp}
			>
				Criar nova conta
			</div>
		</div> 
	);

	const renderRegister = (
		<div className="pg-sign-in-screen__register">
			<span>
				{intl.formatMessage({ id: 'page.header.signIN.noAccountYet' })}
				<span onClick={() => history.push('/banner/authentication/sign-up/basic')} className="pg-sign-in-screen__register-button">
					Cadastrar
				</span>
			</span>
		</div>
	);

	const emailGroupClass = cr('cr-sign-in-form__group', {
		'cr-sign-in-form__group--focused': emailFocused,
	});
	const passwordGroupClass = cr('cr-sign-in-form__group', {
		'cr-sign-in-form__group--focused': passwordFocused,
	});
	const logo = image ? (
		<h1 className="cr-sign-in-form__title">
			<img className="cr-sign-in-form__image" src={image} alt="logo" />
		</h1>
	) : null;

	return (

		
		<form>
			<div className="cr-sign-in-form" onKeyPress={handleEnterPress}>
				{!isMobileDevice && (
					<div className="cr-sign-in-form__options-group-sigin">
						<div className="cr-sign-in-form__option-sigin">
							<div
								className="cr-sign-in-form__option-inner __selected-sigin"
								style={{
									letterSpacing: '1px',
									wordSpacing: '2px',
								}}
							>
								<img className="cr-sign-in-form__image" src={Logo} alt="logo" />
							</div>
						</div>
					</div>
				)}
				<div className="cr-sign-in-form__form-content">
					<div
						data-bn-type="text"
						style={{
							fontSize: '13px',
							textAlign: 'center',
							marginBottom: '18px',
						}}
					>
						Faça seu login com o email utilizado no cadastro
					</div>

					<div className={emailGroupClass}>
						<FormInput
							type="email"
							label={emailLabel || 'Digite seu email'}
							placeholder={emailPlaceholder}
							defaultLabel="Digite seu e-mail"
							handleChangeInput={handleChangeEmail}
							inputValue={email}
							handleFocusInput={() => handleFieldFocus('email')}
							classNameLabel="cr-sign-in-form__label"
							autoFocus={true}
						/>
						{emailError && <div className={'cr-sign-in-form__error'}>{emailError}</div>}
					</div>
					<div className={passwordGroupClass}>
						<FormInput
							type="password"
							label={passwordLabel || 'Password'}
							placeholder={passwordPlaceholder}
							defaultLabel="Password"
							handleChangeInput={handleChangePassword}
							inputValue={password}
							handleFocusInput={() => handleFieldFocus('password')}
							classNameLabel="cr-sign-in-form__label"
							autoFocus={false}
						/>
						{passwordError && <div className={'cr-sign-in-form__error'}>{passwordError}</div>}
					</div>

					{isMobileDevice && renderForgotButton}
					<div className="cr-sign-in-form__button-wrapper">
						<Button
							block={true}
							type="button"
							disabled={isLoading || !email.match(EMAIL_REGEX) || !password}
							onClick={handleClick as any}
							size="lg"
							variant="primary"
						>
							{isLoading ? 'Loading...' : labelSignIn ? labelSignIn : 'Entrar'}
						</Button>
					</div>
					{!isMobileDevice && renderForgotButton}
					{isMobileDevice && renderRegister}
				</div>
			</div>
		</form>

	);
});

export { Login };
