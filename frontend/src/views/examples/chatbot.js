import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  Badge,
  Media,
  UncontrolledTooltip,
} from 'reactstrap';
import { getResponseFromChat } from '../../services/ChatBoot'

const ChatBot = () => {
  const formatMessageContent = (content) => {
    // Détection des blocs de code (entre ```)
    const parts = content.split(/```(\w*)\n([\s\S]*?)```/g);
    
    return parts.map((part, index) => {
      // Si c'est un bloc de code (index impair)
      if (index % 3 === 2) {
        const language = parts[index - 1] || '';
        const code = part;
        
        return (
          <div key={index} style={{
            backgroundColor: '#282c34',
            borderRadius: '8px',
            padding: '16px',
            margin: '12px 0',
            overflowX: 'auto',
            position: 'relative'
          }}>
            {language && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '12px',
                color: '#abb2bf',
                fontSize: '0.8em',
                fontFamily: 'monospace'
              }}>
                {language}
              </div>
            )}
            <pre style={{
              margin: '0',
              color: '#abb2bf',
              fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              tabSize: '4',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      // Si c'est le nom du langage (on ignore car déjà traité)
      if (index % 3 === 1) {
        return null;
      }
      
      // Texte normal avec gestion des sauts de ligne et du gras
      return (
        <div key={index}>
          {part.split('\n').map((paragraph, pIndex) => {
            if (paragraph.trim() === '') return <br key={pIndex} />;
            
            // Gestion du texte en gras (**texte**)
            const boldParts = paragraph.split(/\*\*(.*?)\*\*/g);
            const processedParagraph = boldParts.map((boldPart, bIndex) => {
              if (bIndex % 2 === 1) {
                return <strong key={bIndex}>{boldPart}</strong>;
              }
              return boldPart;
            });
            
            return (
              <p key={pIndex} style={{ 
                marginBottom: '0.5rem',
                lineHeight: '1.6'
              }}>
                {processedParagraph}
              </p>
            );
          })}
        </div>
      );
    });
  };
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      content: "Bonjour ! Je suis votre assistant DevProductivityTracker. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'Comment améliorer ma productivité ?',
    'Quelles sont les causes de mes interruptions ?',
    'Comment réduire mes erreurs de code ?',
    "Quelle est la durée optimale d'une session de codage ?",
    'Puis-je voir un rapport de mes statistiques ?',
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      // Appel à l'API avec la question de l'utilisateur
      const botResponse = await getResponseFromChat(newMessage);
      
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          sender: 'bot',
          content: botResponse,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Erreur lors de la récupération de la réponse", error);
      
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          sender: 'bot',
          content: "Désolé, une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setNewMessage(suggestion);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Container className="mt-4" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow" style={{ height: 'calc(100vh - 100px)' }}>
              <CardHeader className="bg-transparent border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Assistant IA</h3>
                  </div>
                  <div className="col text-right">
                    <Badge color="success" pill>
                      En ligne
                    </Badge>
                  </div>
                </Row>
              </CardHeader>
              <CardBody
                className="pt-0"
                style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 350px)' }}
              >
                <div className="chat-messages p-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message-wrapper mb-3 ${
                        msg.sender === 'user' ? 'text-right' : ''
                      }`}
                    >
                      <Media
                        className={`d-inline-flex ${
                          msg.sender === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div
                          className={`${
                            msg.sender === 'user' ? 'ml-3' : 'mr-3'
                          }`}
                        >
                          {msg.sender === 'bot' ? (
                            <div className="avatar avatar-sm rounded-circle bg-gradient-info">
                              <span
                                className="text-white"
                                style={{
                                  fontSize: '0.8rem',
                                  lineHeight: '30px',
                                }}
                              >
                                IA
                              </span>
                            </div>
                          ) : (
                            <div className="avatar avatar-sm rounded-circle bg-gradient-success">
                              <span
                                className="text-white"
                                style={{
                                  fontSize: '0.8rem',
                                  lineHeight: '30px',
                                }}
                              >
                                VOUS
                              </span>
                            </div>
                          )}
                        </div>
                        <Media body>
                          <div
                            className={`message-bubble p-3 mb-1 ${
                              msg.sender === 'user'
                                ? 'bg-gradient-success text-white'
                                : 'bg-light text-dark'
                            }`}
                            style={{
                              borderRadius: '18px',
                              maxWidth: '75%',
                              display: 'inline-block',
                              textAlign: 'left',
                              whiteSpace: 'pre-wrap'
                            }}
                          >
                            {formatMessageContent(msg.content)}
                          </div>
                          <div
                            className={`text-xs text-muted ${
                              msg.sender === 'user' ? 'text-right' : ''
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </div>
                        </Media>
                      </Media>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="message-wrapper mb-3">
                      <div
                        className="message-bubble bg-light p-3"
                        style={{
                          borderRadius: '18px',
                          display: 'inline-block',
                          maxWidth: '50%',
                        }}
                      >
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardBody>
              <CardFooter className="bg-transparent border-0">
                <Form onSubmit={handleSendMessage}>
                  <FormGroup className="mb-3">
                    <div className="d-flex">
                      <Input
                        placeholder="Posez une question sur votre productivité..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="form-control-rounded"
                      />
                      <Button
                        color="primary"
                        size="md"
                        type="submit"
                        className="ml-2 btn-icon"
                        disabled={isTyping}
                      >
                        <i className="ni ni-send"></i>
                      </Button>
                    </div>
                  </FormGroup>
                </Form>
                <div className="quick-suggestions">
                  <div className="d-flex flex-wrap">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        color="light"
                        size="sm"
                        className="mr-2 mb-2"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow" style={{ height: 'calc(100vh - 100px)' }}>
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Insights & Conseils</h3>
              </CardHeader>
              <CardBody>
                <div className="timeline timeline-one-side">
                  <div className="timeline-block">
                    <span className="timeline-step badge-success">
                      <i className="ni ni-bell-55"></i>
                    </span>
                    <div className="timeline-content">
                      <div className="d-flex justify-content-between">
                        <div>
                          <span className="text-muted text-sm">
                            Aujourd'hui
                          </span>
                          <h5 className="mt-1 mb-0">Pic de productivité</h5>
                        </div>
                      </div>
                      <p className="text-sm mt-1 mb-0">
                        Vos meilleurs moments de productivité sont entre 10h et
                        12h. Planifiez vos tâches complexes pendant cette
                        période.
                      </p>
                    </div>
                  </div>
                  <div className="timeline-block">
                    <span className="timeline-step badge-warning">
                      <i className="ni ni-notification-70"></i>
                    </span>
                    <div className="timeline-content">
                      <div className="d-flex justify-content-between">
                        <div>
                          <span className="text-muted text-sm">
                            Cette semaine
                          </span>
                          <h5 className="mt-1 mb-0">
                            Analyse des interruptions
                          </h5>
                        </div>
                      </div>
                      <p className="text-sm mt-1 mb-0">
                        Vous avez eu 37% moins d'interruptions en désactivant
                        les notifications pendant vos sessions.
                      </p>
                    </div>
                  </div>
                  <div className="timeline-block">
                    <span className="timeline-step badge-info">
                      <i className="ni ni-chart-bar-32"></i>
                    </span>
                    <div className="timeline-content">
                      <div className="d-flex justify-content-between">
                        <div>
                          <span className="text-muted text-sm">Ce mois</span>
                          <h5 className="mt-1 mb-0">Qualité du code</h5>
                        </div>
                      </div>
                      <p className="text-sm mt-1 mb-0">
                        Le ratio erreurs/lignes de code a diminué de 18%.
                        Continuez à utiliser les tests unitaires !
                      </p>
                    </div>
                  </div>
                  <div className="timeline-block">
                    <span className="timeline-step badge-danger">
                      <i className="ni ni-spaceship"></i>
                    </span>
                    <div className="timeline-content">
                      <div className="d-flex justify-content-between">
                        <div>
                          <span className="text-muted text-sm">Objectif</span>
                          <h5 className="mt-1 mb-0">Progression</h5>
                        </div>
                      </div>
                      <p className="text-sm mt-1 mb-0">
                        Vous êtes à 75% de votre objectif hebdomadaire de 20
                        heures de codage productif.
                      </p>
                      <div className="mt-3">
                        <div className="progress">
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: '75%' }}
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx="true">{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }

        .typing-indicator span {
          height: 8px;
          width: 8px;
          float: left;
          margin: 0 1px;
          background-color: #9e9ea1;
          display: block;
          border-radius: 50%;
          opacity: 0.4;
          animation: typing 1s infinite;
        }

        .typing-indicator span:nth-of-type(1) {
          animation-delay: 0s;
        }

        .typing-indicator span:nth-of-type(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-of-type(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-5px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.4;
          }
        }

        .timeline {
          position: relative;
          padding: 0;
          list-style: none;
        }

        .timeline:before {
          position: absolute;
          top: 0;
          left: 1rem;
          height: 100%;
          border-left: 2px solid #e9ecef;
          content: '';
        }

        .timeline-block {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .timeline-step {
          position: absolute;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          text-align: center;
          border-radius: 50%;
          font-size: 1rem;
          color: #fff;
        }

        .timeline-content {
          position: relative;
          margin-left: 3.5rem;
          padding-top: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default ChatBot;
