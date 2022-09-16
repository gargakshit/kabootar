package web

import (
	"encoding/json"
	"errors"
	"strconv"
)

type ProtoSMsg interface {
	Marshal() []string
}

type ProtoPMsg interface {
	Unmarshal(data []string)
}

const (
	ProtoSMJoined = iota
	ProtoSMLeft
	ProtoSMMsg
)

type ProtoSMJoinedPayload struct {
	ClientID string
}

func (p *ProtoSMJoinedPayload) Marshal() []string {
	return []string{strconv.Itoa(ProtoSMJoined), p.ClientID}
}

type ProtoSMLeftPayload struct {
	ClientID string
}

func (p *ProtoSMLeftPayload) Marshal() []string {
	return []string{strconv.Itoa(ProtoSMLeft), p.ClientID}
}

type ProtoSMMsgPayload struct {
	ClientID string
	Msg      string
}

func (p *ProtoSMMsgPayload) Marshal() []string {
	return []string{strconv.Itoa(ProtoSMMsg), p.ClientID, p.Msg}
}

const (
	ProtoMSMsg = iota
)

type ProtoMSMsgPayload struct {
	ClientID string
	Msg      string
}

func (p *ProtoMSMsgPayload) Unmarshal(data []string) {
	p.ClientID = data[1]
	p.Msg = data[2]
}

const (
	ProtoSCMsg = iota
	ProtoSCGone
)

type ProtoSCMsgPayload struct {
	Msg string
}

func (p *ProtoSCMsgPayload) Marshal() []string {
	return []string{strconv.Itoa(ProtoSCMsg), p.Msg}
}

type ProtoSCGonePayload struct{}

func (*ProtoSCGonePayload) Marshal() []string {
	return []string{strconv.Itoa(ProtoSCGone)}
}

const (
	ProtoCSMsg = iota
)

type ProtoCSMsgPayload struct {
	Msg string
}

func (p *ProtoCSMsgPayload) Unmarshal(data []string) {
	p.Msg = data[1]
}

func MarshalSMsg(payload ProtoSMsg) ([]byte, error) {
	return json.Marshal(payload.Marshal())
}

func UnmarshalPMsg(payload []byte, isMaster bool) (ProtoPMsg, error) {
	var msg []string
	err := json.Unmarshal(payload, &msg)
	if err != nil {
		return nil, err
	}

	if len(msg) < 1 {
		return nil, errors.New("invalid payload")
	}

	msgType, err := strconv.Atoi(msg[0])
	if err != nil {
		return nil, err
	}

	if isMaster {
		if msgType == ProtoMSMsg {
			p := &ProtoMSMsgPayload{}
			p.Unmarshal(msg)

			return p, nil
		}
	} else {
		if msgType == ProtoCSMsg {
			p := &ProtoCSMsgPayload{}
			p.Unmarshal(msg)

			return p, nil
		}
	}

	return nil, errors.New("invalid message type")
}
