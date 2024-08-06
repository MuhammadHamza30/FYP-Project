import { Container } from "react-bootstrap";

export const Card = ({
  title,
  value,
  bgcolor,
  Icon,
  txtcolor,
  borderColor,
}) => {
  return (
    <Container className={`dash__card ${borderColor}`}>
      <Container>
        <p className={`font-weight-bold ml-3 ${txtcolor}`}>{value}</p>
        <span className="font-weight-bold ml-3 text-muted">{title}</span>
      </Container>
      <Container className={`dash__card_icon ${bgcolor}`}>
        <Icon />
      </Container>
    </Container>
  );
};
